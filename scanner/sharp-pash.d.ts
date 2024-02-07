declare module "sharp-phash" {
  declare const phash: (buffer: Buffer) => Promise<string>;

  export default phash;
}

declare module "sharp-phash/dist" {
  declare const dist: (hash1: string, hash2: string) => number;

  export default dist;
}
