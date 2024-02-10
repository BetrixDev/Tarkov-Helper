import sharp from "sharp";
import { Vector2 } from "three";
import { getHash } from "../get-hash.js";

const MIN_GRID_COLOR = { r: 73, g: 81, b: 84 };
const MAX_GRID_COLOR = { r: 152, g: 151, b: 139 };

export class CellIndentifier {
  private imgMetadata: sharp.Metadata;
  private pixelData: number[];
  private buffer: Buffer;

  constructor(
    imgMetadata: sharp.Metadata,
    pixelData: number[],
    buffer: Buffer
  ) {
    this.imgMetadata = imgMetadata;
    this.pixelData = pixelData;
    this.buffer = buffer;
  }

  async extractCellHashes() {
    const imgMetadata = this.imgMetadata;

    const extractedCellHashes: string[] = [];

    for (let x = 0; x <= imgMetadata.width!; x++) {
      for (let y = 0; y <= imgMetadata.height!; y++) {
        if (this.isGridPixelCorner(x, y)) {
          const grid = this.walkGrid(x, y);

          if (grid === undefined) continue;

          try {
            const extractedBuffer = await sharp(this.buffer)
              .extract({
                left: x,
                top: y,
                width: 63,
                height: 63,
              })
              .removeAlpha()
              .jpeg({ quality: 100 })
              .toBuffer();

            extractedCellHashes.push(
              await getHash(extractedBuffer, "image/jpeg")
            );
          } catch {}
        }
      }
    }

    return extractedCellHashes;
  }

  private walkGrid(startingX: number, startingY: number) {
    const northWestCorner = new Vector2(startingX, startingY);
    let southEastCorner: Vector2 | undefined;

    for (let x = startingX + 1; x < startingX + 70; x++) {
      if (this.isGridPixelCorner(x, startingY)) {
        const gridDistance = x - startingX;

        if (this.isGridPixelCorner(x, startingY + gridDistance)) {
          southEastCorner = new Vector2(x, startingY + gridDistance);
          break;
        }
      }
    }

    if (southEastCorner === undefined) return;

    return [northWestCorner, southEastCorner];
  }

  private isGridPixelCorner(x: number, y: number) {
    const isGridPixel = this.isGridPixel(x, y);
    const isEastGridPixel = this.isGridPixel(x + 1, y);
    const isSouthGridPixel = this.isGridPixel(x, y + 1);
    const isSouthEastGridPixel = this.isGridPixel(x + 1, y + 1);
    const isNorthEashGridPixel = this.isGridPixel(x + 1, y - 1);

    return (
      isGridPixel &&
      isEastGridPixel &&
      isSouthGridPixel &&
      !isSouthEastGridPixel &&
      !isNorthEashGridPixel
    );
  }

  private isGridPixel(x: number, y: number) {
    const rgb = this.getRGBAtPos(x, y);

    const isRValid = rgb.r <= MAX_GRID_COLOR.r && rgb.r >= MIN_GRID_COLOR.r;
    const isGValid = rgb.g <= MAX_GRID_COLOR.g && rgb.g >= MIN_GRID_COLOR.g;
    const isBValid = rgb.b <= MAX_GRID_COLOR.b && rgb.b >= MIN_GRID_COLOR.b;

    return isRValid && isGValid && isBValid;
  }

  private getRGBAtPos(x: number, y: number) {
    const index = 3 * (this.imgMetadata.width! * y + x);

    const { r, g, b } = {
      r: this.pixelData[index]!,
      g: this.pixelData[index + 1]!,
      b: this.pixelData[index + 2]!,
    };

    return {
      r,
      g,
      b,
    };
  }
}
