import sharp from "sharp";
import { CellIndentifier } from "./models/CellIndentifier";

export async function extractIconHashesFromInventory(inputImage: Buffer) {
  const img = sharp(inputImage).removeAlpha();
  const imgMetadata = await img.metadata();
  const rawImg = await img.raw().toBuffer({ resolveWithObject: true });

  const identifier = new CellIndentifier(
    imgMetadata,
    rawImg.data.toJSON().data,
    inputImage
  );

  return await identifier.extractCellHashes();
}
