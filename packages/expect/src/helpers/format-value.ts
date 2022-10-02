export type ValueFormatter = (value: unknown) => string;

export const formatValue: ValueFormatter = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'function') {
    return value.name || 'function';
  }

  return String(value);
};
