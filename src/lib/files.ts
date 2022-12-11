import { PathLike, readFileSync } from "fs";

export function readJson<T>(path: PathLike | string): T {
    return JSON.parse(readFileSync(path).toString()) as T;
}
