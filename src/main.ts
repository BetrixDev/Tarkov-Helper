import "reflect-metadata";
import { Client, DIService } from "discordx";
import { Intents } from "discord.js";
import { importx } from "@discordx/importer";
import dotenv from "dotenv";
import { container } from "tsyringe";
import { config } from "./config";
import { TarkovDataService } from "./services/TarkovDataService";
import { ItemSearchEngine } from "./lib/search_engines/ItemSearchEngine";

dotenv.config();

const isDev = config.process.isDev;
const isTest = config.process.isTest;

// Dependency Injection Setup
DIService.container = container;

export const client = new Client({
    botGuilds: isDev ? [(client) => client.guilds.cache.map((guild) => guild.id)] : undefined,
    intents: [Intents.FLAGS.GUILDS]
});

client.once("ready", async () => {
    // make sure all guilds are in cache
    await client.guilds.fetch();

    // init all application commands
    await client.initApplicationCommands();

    // init permissions; enabled log to see changes
    await client.initApplicationPermissions();

    if (!isDev) {
        // uncomment this line to clear all guild commands,
        // useful when moving to global commands from guild commands
        await client.clearApplicationCommands(...client.guilds.cache.map((g) => g.id));
    }
    console.log("Tarkov Helper started");
});

export async function main(): Promise<void> {
    // Cache initial data
    const dataService = container.resolve(TarkovDataService);

    if (config.process.isDev || config.process.isTest) {
        await dataService.initTestData();
    } else {
        await dataService.init();
        await dataService.cron();
    }

    container.resolve(ItemSearchEngine).init();

    await importx(__dirname + "/discord/{events,commands}/*.{ts,js}");

    const botToken = config.env.botToken;

    // Let's start the bot
    if (botToken === undefined) {
        throw Error("BOT_TOKEN not set in env");
    }

    if (!isTest) {
        // Log in with your bot token
        await client.login(botToken);
    }
}

main();
