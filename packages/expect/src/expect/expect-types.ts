import { AssertionFailed } from '../errors/assertion-failed';
import { MessageFormatter, ValueFormatter } from '../helpers/message-formatter';

export interface AssertionDefinition<Name extends AssertionNames, Subject, Value, Meta> {
  name: Name;

  expectedType?: string;
  guard?(subject: unknown): subject is Subject;

  prepare?(
    subject: Subject,
    ...args: Parameters<Expect.Assertions[Name]>
  ): { actual: Value; expected?: Value; meta?: Meta };

  prepareAsync?(
    promise: Promise<Subject>,
    ...args: Parameters<Expect.Assertions[Name]>
  ): Promise<{ actual: Value; expected?: Value; meta?: Meta }>;

  assert(
    this: { compare: (a: unknown, b: unknown) => boolean },
    actual: Value,
    expected: Value,
    meta: Meta
  ): ReturnType<Expect.Assertions[Name]> | Promise<ReturnType<Expect.Assertions[Name]>>;

  getMessage(
    this: { not: boolean; formatter: MessageFormatter; formatValue: ValueFormatter },
    error: AssertionFailed<Meta>
  ): string;
}

export type AssertionDefinitions = {
  [Name in AssertionNames]: AssertionDefinition<Name, unknown, unknown, unknown>;
};

export type AssertionNames = keyof Expect.Assertions;

export type AnyAssertionDefinition = AssertionDefinition<AssertionNames, unknown, unknown, unknown>;

export type AnyAssertion = Expect.Assertions[AssertionNames];
export type AnyAssertionParams = Parameters<AnyAssertion>;
export type AnyAssertionResult = ReturnType<AnyAssertion>;
