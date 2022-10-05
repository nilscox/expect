import { formatValue } from '../helpers/format-value';
import { mapObject } from '../helpers/map-object';
import { any } from '../matchers/any';
import { anything } from '../matchers/anything';
import { objectWith } from '../matchers/object-with';
import { stringMatching } from '../matchers/string-matching';
import { async, rejects } from './async';
import { createAssertion } from './create-assertion';
import {
  AnyAssertionDefinition,
  AnyAssertionResult,
  AssertionDefinition,
  AssertionNames,
} from './expect-types';
import { addMatcher } from './matchers';

type AssertionDefinitions = {
  [Name in AssertionNames]: AssertionDefinition<Name, unknown>;
};

type Not<Actual> = {
  not: Expect.Assertions<Actual>;
};

declare global {
  namespace Expect {
    interface ExpectFunction {
      <Actual>(actual: Actual): Expect.Assertions<Actual> & Not<Actual>;
    }

    interface ExpectFunction {
      _assertions: AssertionDefinitions;
      addAssertion<Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>): void;
    }

    interface ExpectFunction {
      formatValue: typeof formatValue;
    }
  }
}

export const createAssertions = (not: boolean, actual: unknown) => {
  return mapObject<AssertionNames, AnyAssertionDefinition, AnyAssertionResult>(
    expect._assertions,
    (assertion) => createAssertion(not, actual, assertion)
  );
};

export const expect: Expect.ExpectFunction = (actual: unknown) => ({
  ...createAssertions(false, actual),
  not: createAssertions(true, actual),
});

expect._assertions = {} as AssertionDefinitions;

expect.addAssertion = <Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>) => {
  if (assertion.name in expect._assertions) {
    throw new Error(`cannot add assertion "${assertion.name}" because it already exits`);
  }

  expect._assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};

expect.formatValue = formatValue;

expect.anything = anything;
expect.any = any;
expect.stringMatching = stringMatching;
expect.objectWith = objectWith;

expect.addMatcher = addMatcher.bind(expect);

expect.async = async.bind(expect);
expect.rejects = rejects.bind(expect);
