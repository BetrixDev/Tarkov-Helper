import { Region, Sharp } from "sharp";

export async function extractAndHashCell(baseImage: Sharp, region: Region) {
  const data = await baseImage
    .extract(region)
    .greyscale()
    .resize(32, 32, { fit: "fill" })
    .rotate()
    .raw()
    .toBuffer();
}
