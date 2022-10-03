import { get } from './get';

export type Matcher<Type> = (value: Type) => boolean;

const matcherSymbol = Symbol('matcher');

export const createMatcher = <Type, Args extends unknown[]>(
  check: (value: Type, ...args: Args) => boolean
) => {
  const matcher = (...args: Args) => {
    const matchValue = (value: Type) => {
      return check(value, ...args);
    };

    matchValue.symbol = matcherSymbol;
    matchValue.args = args;

    return matchValue;
  };

  return matcher as unknown as (...args: Args) => Type;
};

export const isMatcher = (value: unknown): value is Matcher<unknown> => {
  return get(value, 'symbol') === matcherSymbol;
};

export const castAsMatcher = <Type>(value: Type) => {
  return value as Matcher<Type>;
};