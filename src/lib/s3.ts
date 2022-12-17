import { S3 } from "@aws-sdk/client-s3";
import { Credentials } from "aws-sdk";
import { env } from "../env";

const client = new S3({
    endpoint: `https://${env.S3_ENDPOINT}`,
    credentials: new Credentials(env.S3_KEY, env.S3_SECRET),
    useAccelerateEndpoint: false,
    region: "us-east-1"
});

export const readFromBucketJSON = async <T = unknown>(key: string): Promise<T> => {
    const data = await client.getObject({ Bucket: env.S3_NAME, Key: `json/${key}.json` });

    if (!data.Body) {
        throw new Error(`Error fetching fiel ${key} from bucket`);
    }

    return JSON.parse(await data.Body.transformToString());
};
