import { formatValue } from '../helpers/format-value';
import { mapObject } from '../helpers/map-object';
import { any } from '../matchers/any';
import { anything } from '../matchers/anything';
import { objectWith } from '../matchers/object-with';
import { stringMatching } from '../matchers/string-matching';
import { addAssertion, addCustomAssertion, cleanupAssertion } from './assertions';
import { async, rejects } from './async';
import { createAssertion } from './create-assertion';
import {
  AnyAssertionDefinition,
  AnyAssertionResult,
  AssertionDefinitions,
  AssertionNames,
} from './expect-types';
import { addCustomMatcher, addMatcher, cleanupMatchers } from './matchers';

type Not<Actual> = {
  not: Expect.Assertions<Actual>;
};

declare global {
  namespace Expect {
    interface ExpectFunction {
      <Actual>(actual: Actual): Expect.Assertions<Actual> & Not<Actual>;
    }

    interface ExpectFunction {
      formatValue: typeof formatValue;
      cleanup(): void;
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
expect._customAssertions = new Set();
expect.addAssertion = addAssertion.bind(expect);
expect.addCustomAssertion = addCustomAssertion.bind(expect);

expect.formatValue = formatValue;

expect.anything = anything;
expect.any = any;
expect.stringMatching = stringMatching;
expect.objectWith = objectWith;

expect._customMatchers = new Set();
expect.addMatcher = addMatcher.bind(expect);
expect.addCustomMatcher = addCustomMatcher.bind(expect);

expect.async = async.bind(expect);
expect.rejects = rejects.bind(expect);

expect.cleanup = () => {
  cleanupAssertion.call(expect);
  cleanupMatchers.call(expect);
};
