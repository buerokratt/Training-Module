export const truncateNumber = (value: number, precision: number = 2) => {
  return Number(value.toString().match(/^\d+(?:\.\d{0,2})?/));
};
