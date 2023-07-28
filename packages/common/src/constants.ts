export const USEC_DOGTAG_ITEM_ID = "59f32c3b86f77472a31742f0";
export const BEAR_DOGTAG_ITEM_ID = "59f32bb586f774757e1e8442";

export const ROUBLE_ITEM_ID = "5449016a4bdc2d6f028b456f";

/** Unicode value for a zero width space */
export const ZERO_WIDTH = "\u200b";

/** Creates an empty embed object used to align embed fields */
export const EMTPY_EMBED_FIELD = (inline = true) => ({
  name: ZERO_WIDTH,
  value: ZERO_WIDTH,
  inline,
});
