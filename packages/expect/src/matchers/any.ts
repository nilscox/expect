import { createMatcher } from '../helpers/create-matcher';

// prettier-ignore
type ConstructorToType<T> =
  T extends StringConstructor   ? string :
  T extends NumberConstructor   ? number :
  T extends BigIntConstructor   ? bigint :
  T extends BooleanConstructor  ? boolean :
  T extends SymbolConstructor   ? symbol :
  T extends DateConstructor     ? Date :
  T extends ObjectConstructor   ? any :
  T extends FunctionConstructor ? (...args: any[]) => any :
  T;

const ctorMap = {
  string: String,
  number: Number,
  bigint: BigInt,
  boolean: Boolean,
  symbol: Symbol,
  function: Function,
};

export const any = createMatcher(
  <Ctor>(obj: ConstructorToType<Ctor>, constructor: Ctor) => {
    const primitiveCtor = ctorMap[typeof obj as keyof typeof ctorMap];

    if (primitiveCtor) {
      return constructor === primitiveCtor;
    }

    return obj instanceof (constructor as any);
  },
  (constructor) => {
    return `any ${(constructor as any).name}`;
  }
);
