import { formatValue } from '../helpers/format-value';
import { mapObject } from '../helpers/map-object';
import { any } from '../matchers/any';
import { anything } from '../matchers/anything';
import { objectWith } from '../matchers/object-with';
import { stringMatching } from '../matchers/string-matching';
import { addAssertion, addCustomAssertion, cleanupAssertion } from './assertions';
import { createAssertion } from './create-assertion';
import {
  AnyAssertionDefinition,
  AnyAssertionResult,
  AssertionDefinitions,
  AssertionNames,
} from './expect-types';
import { addCustomMatcher, addMatcher, cleanupMatchers } from './matchers';

type AnyFunction = (...args: any[]) => any;
type AnyPromise = Promise<any>;
type AnyObject = Record<PropertyKey, any>;

declare global {
  namespace Expect {
    interface StringAssertions<Actual extends string> {}
    interface NumberAssertions<Actual extends number> {}
    interface BooleanAssertions<Actual extends boolean> {}
    interface ArrayAssertions<Actual extends unknown[]> {}
    interface FunctionAssertions<Actual extends AnyFunction> {}
    interface PromiseAssertions<Actual extends Promise<unknown>> {}
    interface ObjectAssertions<Actual extends AnyObject> {}
    interface GenericAssertions<Actual> {}

    interface Assertions
      extends StringAssertions<any>,
        NumberAssertions<any>,
        BooleanAssertions<any>,
        ArrayAssertions<any>,
        FunctionAssertions<any>,
        PromiseAssertions<any>,
        ObjectAssertions<any>,
        GenericAssertions<any> {}

    type ExpectResult<Assertion, Actual> = Assertion &
      Expect.GenericAssertions<Actual> & {
        not: Assertion & Expect.GenericAssertions<Actual>;
      };

    interface ExpectFunction {
      <Actual extends string>(actual: Actual): ExpectResult<Expect.StringAssertions<Actual>, Actual>;
      <Actual extends number>(actual: Actual): ExpectResult<Expect.NumberAssertions<Actual>, Actual>;
      <Actual extends boolean>(actual: Actual): ExpectResult<Expect.BooleanAssertions<Actual>, Actual>;
      <Actual extends unknown[]>(actual: Actual): ExpectResult<Expect.ArrayAssertions<Actual>, Actual>;
      <Actual extends AnyFunction>(actual: Actual): ExpectResult<Expect.FunctionAssertions<Actual>, Actual>;
      <Actual extends AnyPromise>(actual: Actual): ExpectResult<Expect.PromiseAssertions<Actual>, Actual>;
      <Actual extends AnyObject>(actual: Actual): ExpectResult<Expect.ObjectAssertions<Actual>, Actual>;
      <Actual>(actual: Actual): ExpectResult<Expect.GenericAssertions<Actual>, Actual>;
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
    (assertion) => createAssertion(assertion, not, actual)
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

expect.cleanup = () => {
  cleanupAssertion.call(expect);
  cleanupMatchers.call(expect);
};
