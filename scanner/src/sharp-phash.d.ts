declare module "sharp-phash" {
  declare async function phash(buffer: Buffer): Promise<string>;

  export default phash;
}
