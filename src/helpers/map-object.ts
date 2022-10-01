export const mapObject = <T extends {}, Y>(
  input: T,
  transformProperty: <K extends keyof T & keyof Y>(keyValue: [K, T[K]]) => Y[K]
): Y => {
  return Object.entries(input).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: transformProperty([key as keyof T & keyof Y, value as T[keyof T & keyof Y]]),
    }),
    {} as Y
  );
};
