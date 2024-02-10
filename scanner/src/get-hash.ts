import { imageHash } from "image-hash";

export async function getHash(buffer: Buffer, ext: string) {
  return new Promise<string>((res) => {
    imageHash(
      { ext: ext, data: buffer },
      16,
      true,
      (_: never, data: string) => {
        res(data);
      }
    );
  });
}
