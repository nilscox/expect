export type ValueFormatter = (value: unknown) => string;

export const formatValue: ValueFormatter = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return String(value);
};
