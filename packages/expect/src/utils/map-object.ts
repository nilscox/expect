export const mapObject = <K extends string, IV, OV>(
  input: Record<K, IV>,
  transformProperty: (value: IV, key: K, index: number) => OV
): Record<K, OV> => {
  return Object.entries(input).reduce(
    (obj, [key, value], index) => ({
      ...obj,
      [key]: transformProperty(value as IV, key as K, index),
    }),
    {} as Record<K, OV>
  );
};
