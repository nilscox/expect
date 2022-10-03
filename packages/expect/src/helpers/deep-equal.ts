import { isMatcher } from './create-matcher';

const objectKeys = <T extends object>(obj: T) => {
  return Object.getOwnPropertyNames(obj);
};

export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (isMatcher(b)) {
    return b(a);
  }

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return a === b;
  }

  const aKeys = objectKeys(a).filter((key) => a[key as keyof typeof a] !== undefined);
  const bKeys = objectKeys(b).filter((key) => b[key as keyof typeof b] !== undefined);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    const aValue = a[key as keyof typeof a];

    if (!(key in b)) {
      return false;
    }

    const bValue = b[key as keyof typeof b];

    if (a instanceof Error && key === 'stack') {
      continue;
    }

    if (!deepEqual(aValue, bValue)) {
      return false;
    }
  }

  return true;
};
