// is an open edition
export const OPEN_EDITION_QUANTITY_UPPER_BOUND = 2147483647;

export const isOpenEdition = (upperBound: number) => (
  upperBound === OPEN_EDITION_QUANTITY_UPPER_BOUND
)
