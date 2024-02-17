import path from "path";
import phash from "sharp-phash";

export async function getHash(buffer: Buffer) {
  return await phash(buffer);
}
