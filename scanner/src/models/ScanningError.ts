export const SCANNING_ERROR_MESSAGES = {
  zero_pixel_image: "Image has no size",
  no_items_in_image: "There were no items found in the image",
} as const;

export class ScanningError extends Error {
  constructor(type: keyof typeof SCANNING_ERROR_MESSAGES) {
    super(SCANNING_ERROR_MESSAGES[type]);
  }
}
