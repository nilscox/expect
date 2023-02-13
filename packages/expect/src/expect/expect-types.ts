import { AssertionFailed } from '../errors/assertion-failed';
import { ValueFormatter } from '../helpers/format-value';

export type Helpers = {
  // rename to compare
  deepEqual: (a: unknown, b: unknown) => boolean;
  formatValue: ValueFormatter;
};

export interface AssertionDefinition<Name extends AssertionNames, Actual> {
  name: Name;

  expectedType?: string;
  guard?(actual: unknown): actual is Actual;

  assert(
    this: Helpers,
    actual: Actual,
    ...args: Parameters<Expect.Assertions[Name]>
  ): ReturnType<Expect.Assertions[Name]>;

  getMessage(
    this: Helpers & { not: boolean; error: AssertionFailed },
    actual: Actual,
    ...args: Parameters<Expect.Assertions[Name]>
  ): string;
}

export type AssertionDefinitions = {
  [Name in AssertionNames]: AssertionDefinition<Name, unknown>;
};

export type AssertionNames = keyof Expect.Assertions;

export type AnyAssertionDefinition = AssertionDefinition<AssertionNames, unknown>;

export type AnyAssertion = Expect.Assertions[AssertionNames];
export type AnyAssertionParams = Parameters<AnyAssertion>;
export type AnyAssertionResult = ReturnType<AnyAssertion>;
