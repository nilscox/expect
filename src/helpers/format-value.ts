export const formatValue = (value: unknown) => {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  return value;
};
