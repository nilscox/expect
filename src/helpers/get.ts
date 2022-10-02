export const get = (object: unknown, path: string): unknown => {
  let current: any = object;

  for (const key of path.split('.')) {
    if (!current) {
      return;
    }

    current = current[key];
  }

  return current;
};
