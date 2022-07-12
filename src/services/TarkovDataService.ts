import "reflect-metadata";
import axios from "axios";
import { injectable, singleton } from "tsyringe";
import { ApiResponses, DataResponses } from "../../types/services/TarkovDataService";
import { scheduleJob } from "node-schedule";
import { config } from "../config";
import { existsSync } from "fs";
import { readJson } from "../lib/util/files";
import { TarkovDevItem } from "../../types/tarkov.dev/TarkovDevItem";

// This file attempts to make the data collection layer as easy as possible by abstracting the data querying behind simple functions
// don't look too closely or you might be able to taste the spaghetti

const TARKOV_DEV_QUERIES: Record<string, string> = {
    "items-tarkov-dev": `
    {
        items {
            id
            shortName
            name
            types
            updated
            changeLast48hPercent
            width
            height
            wikiLink
            basePrice
            avg24hPrice
            sellFor {
                vendor {
                    name
                }
                priceRUB
            }
            buyFor {
                vendor {
                    name
                }
                priceRUB
            }
        }
    }      
    `,
    barters: `
    {
        barters {
            id
            trader {
                name
            }
            level
            requiredItems {
                count
                item {
                    id
                    name
                }
                attributes {
                    type
                    name
                    value
                }
            }
            rewardItems {
                count
                item {
                    id
                    name
                }
                attributes {
                    type
                    name
                    value
                }
            }
        }
    }      
    `,
    hideoutStations: `
    {
        hideoutStations {
            id
            name
            levels {
                id
                level
                constructionTime
                itemRequirements {
                    id
                    item {
                        id
                        name
                    }
                        count
                    }
                    stationLevelRequirements {
                        id
                    station {
                        name
                    }
                    level
                }
            }
        }
    }      
    `,
    traders: `
        {
            traders {
                name
                resetTime
            }
        }
    `,
    status: `
        {
            status {
                currentStatuses {
                    name
                    statusCode
                }
                generalStatus {
                    name
                    message
                    status
                    statusCode
                }
            }
        }
    `,
    crafts: `
    {
        crafts {
            id
            station {
                id
                name
            }
            level
            duration
            requiredItems {
                count
                item {
                    id
                    name
                }
                attributes {
                    type
                    name
                    value
                }
            }
            rewardItems {
                count
                item {
                    id
                    name
                }
                attributes {
                    type
                    name
                    value
                }
            }
        }
    }
    `,
    tasks: `
    {
        tasks {
          id
          tarkovDataId
          name
          trader {
            name
          }
          map {
            name
          }
          experience
          wikiLink
          minPlayerLevel
          taskRequirements {
            task {
              name
            }
            status
          }
          traderLevelRequirements {
            id
            trader {
              name
            }
            level
          }
          objectives {
            id
            type
            description
            maps {
              name
            }
            optional
            ... on TaskObjectiveItem {
              id
              item {
                id
                name
              }
              count
              foundInRaid
            }
          }
          startRewards {
            items {
              item {
                id
                name
              }
              count
            }
            offerUnlock {
              trader {
                name
              }
              level
              item {
                id
                name
              }
            }
            traderUnlock {
              name
            }
          }
          finishRewards {
            items {
              item {
                id
                name
              }
              count
            }
            offerUnlock {
              trader {
                name
              }
              level
              item {
                id
                name
              }
            }
            traderUnlock {
              name
            }
          }
        }
      }      
    `
};

interface RestApiData {
    type: "REST";
    url: string;
    endpoints: Readonly<string[]>;
    token?: string;
}

interface GraphQLApiData {
    type: "GRAPHQL";
    url: string;
    endpoints: Readonly<string[]>;
    /** Keys are the entries in endpoints above */
    queries: Record<string, string>;
}

type ApiData = RestApiData | GraphQLApiData;

const CONFIGS = {
    TARKOV_CHANGES_CONFIG: {
        type: "REST",
        url: "https://api.tarkov-changes.com/v1/{ENDPOINT}",
        endpoints: ["items-tarkov-changes", "ammo"],
        token: config.env.tarkovChangesToken
    },
    TARKOV_DEV_CONFIG: {
        type: "GRAPHQL",
        url: "https://api.tarkov.dev/graphql",
        endpoints: ["items-tarkov-dev", "barters", "hideoutStations", "traders", "status", "crafts", "tasks"],
        queries: TARKOV_DEV_QUERIES
    },
    TARKOV_DATA_CONFIG: {
        type: "REST",
        url: "https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/{ENDPOINT}.json",
        endpoints: ["quests"]
    },
    TARKOV_DATABASE_CONFIG: {
        type: "REST",
        url: "https://raw.githubusercontent.com/Tarkov-Helper/Database/main/{ENDPOINT}.json",
        endpoints: ["mapkeys", "keys", "questGuides", "mapImages"] // TODO: Rename these in the repo
    },
    SP_TARKOV_CONFIG: {
        type: "REST",
        url: "https://dev.sp-tarkov.com/SPT-AKI/Server/raw/branch/18969/project/assets/database/{ENDPOINT}.json",
        // these are ugly
        endpoints: [
            "globals",
            "bots/types/bossbully",
            "bots/types/bossgluhar",
            "bots/types/bosskilla",
            "bots/types/bosskojaniy",
            "bots/types/bosstagilla",
            "bots/types/followerbigpipe",
            "bots/types/followerbirdeye",
            "bots/types/bossknight",
            "bots/types/exusec",
            "locales/global/en",
            "locales/global/es",
            "locations/bigmap/base",
            "locations/factory4_day/base",
            "locations/factory4_night/base",
            "locations/interchange/base",
            "locations/laboratory/base",
            "locations/lighthouse/base",
            "locations/rezervbase/base",
            "locations/woods/base",
            "templates/quests"
        ]
    }
} as const;

type Endpoint =
    | typeof CONFIGS.TARKOV_CHANGES_CONFIG.endpoints[number]
    | typeof CONFIGS.TARKOV_DEV_CONFIG.endpoints[number]
    | typeof CONFIGS.TARKOV_DATA_CONFIG.endpoints[number]
    | typeof CONFIGS.TARKOV_DATABASE_CONFIG.endpoints[number]
    | typeof CONFIGS.SP_TARKOV_CONFIG.endpoints[number];

type TestData = { data: unknown; name: string };

@singleton()
@injectable()
export class TarkovDataService {
    private readonly cache = new Map<Endpoint, { data: unknown; time: number }>();

    /** Query initial data and store in the cache */
    async init() {
        await this.queryAll();
    }

    /** Used to pre-cache all data before running tests to reduce time and amount of queries */
    async fetchTestData(): Promise<TestData[]> {
        return (await this.queryAll(true)) as TestData[];
    }

    /** Load pre-fetched test data into memory */
    async initTestData() {
        Object.values(CONFIGS).forEach(async (apiConfig) => {
            apiConfig.endpoints.forEach(async (endpoint) => {
                const data = await this.resolveEndpoint(endpoint)();

                this.cache.set(endpoint, {
                    data,
                    time: Date.now()
                });

                return;
            });

            return;
        });
    }

    /** When invoked, will run `queryAll` every 30 minutes */
    async cron() {
        scheduleJob("*/30 * * * *", async () => {
            this.queryAll();
        });
    }

    private async queryAll(returnData?: boolean) {
        const queries = Object.values(CONFIGS)
            // Resolve all endpoints
            .map((apiConfig) => {
                return apiConfig.endpoints.map((endpoint) => {
                    return new Promise<TestData>(async (resolve) => {
                        try {
                            let data = await this.resolveEndpoint(endpoint)();

                            // clean up some of the responses
                            if (endpoint === "items-tarkov-changes") {
                                const rawData = data as ApiResponses["items-tarkov-changes"];

                                data = rawData.results.reduce<Record<string, any>>((prev, curr) => {
                                    return { ...prev, [curr["Item ID"]]: JSON.parse(curr.props) };
                                }, {});
                            } else if (endpoint === "items-tarkov-dev") {
                                const rawData = data as ApiResponses["items-tarkov-dev"];

                                data = rawData.reduce<Record<string, TarkovDevItem>>((prev, curr) => {
                                    return { ...prev, [curr.id]: curr };
                                }, {});
                            }

                            this.cache.set(endpoint, { data, time: Date.now() });

                            resolve({
                                data: data,
                                name: endpoint
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    });
                });
            })
            // Flatten 2d array
            .reduce((a, b) => {
                return [...a, ...b];
            }, []);

        const apiData = await Promise.all(queries);

        if (returnData) {
            return apiData;
        }
    }

    /**
     * Grab data from cache or fetch new data
     * @param endpoint Endpoint mapped to a specific API
     * @returns The response of that endpoint
     */
    fetchData<E extends Endpoint, T = DataResponses[E]>(endpoint: E): T {
        const cachedData = this.cache.get(endpoint);

        return cachedData?.data as T;
    }

    /** Returns a function that can be called to fetch the data specified */
    private resolveEndpoint(e: Endpoint) {
        const endpoint = e.split("-")[0];
        const apiConfig = Object.values(CONFIGS).find((config) => {
            const endpoints = config.endpoints as unknown as any[];
            return endpoints.includes(e);
        }) as ApiData;

        if (config.process.isTest || config.process.isDev) {
            return async () => {
                const filePath = `./data/${e.replaceAll("/", "_")}.json`;

                if (!existsSync(filePath)) {
                    throw new Error("Error locating file for test data. Run `npm run init:dev` to cache test data");
                }

                return readJson(filePath);
            };
        }

        if (apiConfig.type === "GRAPHQL") {
            return async () => {
                const response = await axios(apiConfig.url, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    data: JSON.stringify({
                        query: apiConfig.queries[e]
                    })
                });

                return response.data["data"][endpoint];
            };
        } else {
            return async () => {
                const response = await axios(apiConfig.url.replace("{ENDPOINT}", endpoint), {
                    headers: apiConfig.token
                        ? {
                              "AUTH-TOKEN": apiConfig.token
                          }
                        : {}
                });
                return response.data;
            };
        }
    }
}