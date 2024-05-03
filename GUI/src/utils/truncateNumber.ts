export const truncateNumber = (value: number) => {
  return Number(/^\d+(?:\.\d{0,2})?/.exec(value.toString()));
};
