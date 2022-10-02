import { get } from './get';

const anythingSymbol = Symbol('anything');

export const anything = (): any => {
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

// prettier-ignore
type AnyCtorType<T> =
  T extends StringConstructor ? string :
  T extends NumberConstructor ? number :
  T extends BigIntConstructor ? bigint :
  T extends BooleanConstructor ? boolean :
  T extends SymbolConstructor ? symbol :
  T extends ObjectConstructor ? any :
  T extends FunctionConstructor ? (...args: any[]) => any :
  T;

export const any = <Ctor extends Function>(ctor: Ctor): AnyCtorType<Ctor> =>
  ({
    anyCtorSymbol,
    ctor,
  } as any);

const isAnyCtorValue = (value: unknown): value is AnyCtor => {
  return value != null && get(value, 'anyCtorSymbol') === anyCtorSymbol;
};

const ctorMap = {
  string: String,
  number: Number,
  bigint: BigInt,
  boolean: Boolean,
  symbol: Symbol,
  function: Function,
};

const isAnyCtor = (obj: unknown, value: unknown): boolean => {
  if (!isAnyCtorValue(value)) {
    return false;
  }

  const primitiveCtor = ctorMap[typeof obj as keyof typeof ctorMap];

  if (primitiveCtor) {
    return value.ctor === primitiveCtor;
  }

  return obj instanceof value.ctor;
};

const objectKeys = <T extends object>(obj: T) => {
  return Object.getOwnPropertyNames(obj);
};

export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (isAnything(b) || isAnyCtor(a, b)) {
    return true;
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

    if (!deepEqual(aValue, bValue)) {
      return false;
    }
  }

  return true;
};
