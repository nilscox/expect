import { get } from './get';

const anythingSymbol = Symbol('anything');

export const anything = () => {
  return anythingSymbol;
};

const isAnything = (value: unknown): boolean => {
  return value === anythingSymbol;
};

const anyCtorSymbol = Symbol('any');
type AnyCtor = {
  anyCtorSymbol: typeof anyCtorSymbol;
  ctor: Function;
};

export const any = (ctor: Function): AnyCtor => ({
  anyCtorSymbol,
  ctor,
});

const isAnyCtorValue = (value: unknown): value is AnyCtor => {
  return value != null && get(value, 'anyCtorSymbol') === anyCtorSymbol;
};

const isAnyCtor = (obj: unknown, value: unknown): boolean => {
  if (!isAnyCtorValue(value)) {
    return false;
  }

  if (typeof obj === 'string') {
    return value.ctor === String;
  }

  return obj instanceof value.ctor;
};

export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return a === b;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key of Object.getOwnPropertyNames(a)) {
    const aValue = a[key as keyof typeof a];

    if (!(key in b)) {
      return false;
    }

    const bValue = b[key as keyof typeof b];

    if (isAnything(bValue)) {
      continue;
    }

    if (isAnyCtor(aValue, bValue)) {
      continue;
    }

    if (!deepEqual(aValue, bValue)) {
      return false;
    }
  }

  return true;
};
