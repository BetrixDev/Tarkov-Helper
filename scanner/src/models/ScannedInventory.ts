import sharp, { Sharp } from "sharp";
import { CellIndentifier } from "./CellIndentifier";

export class ScannedInventory {
  private img: Sharp;
  private buffer: Buffer;

  constructor(input: Buffer) {
    this.buffer = input;
    this.img = sharp(input).removeAlpha();
  }

  async extractCells() {
    const imgMetadata = await this.img.metadata();
    const rawImg = await this.img.raw().toBuffer({ resolveWithObject: true });

    const indentifier = new CellIndentifier(
      imgMetadata,
      rawImg.data.toJSON().data,
      this.buffer
    );

    let cellHashes = await indentifier.extractCellHashes();

    console.log(cellHashes);
  }
}
