import { any } from '../matchers/any';
import { anything } from '../matchers/anything';
import { objectWith } from '../matchers/object-with';
import { stringMatching } from '../matchers/string-matching';
import { mapObject } from '../utils/map-object';
import { addAssertion } from './assertions';
import { createAssertion } from './create-assertion';
import {
  AnyAssertionDefinition,
  AnyAssertionResult,
  AssertionDefinitions,
  AssertionNames,
} from './expect-types';
import { addFormatter, format } from './formatters';
import { addMatcher } from './matchers';

type AnyArray = any[];
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
      <Actual extends AnyArray>(actual: Actual): ExpectResult<Expect.ArrayAssertions<Actual>, Actual>;
      <Actual extends AnyFunction>(actual: Actual): ExpectResult<Expect.FunctionAssertions<Actual>, Actual>;
      <Actual extends AnyPromise>(actual: Actual): ExpectResult<Expect.PromiseAssertions<Actual>, Actual>;
      <Actual extends AnyObject>(actual: Actual): ExpectResult<Expect.ObjectAssertions<Actual>, Actual>;
      <Actual>(actual: Actual): ExpectResult<Expect.GenericAssertions<Actual>, Actual>;
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
expect._formatters = [];

expect.addAssertion = addAssertion.bind(expect);
expect.addMatcher = addMatcher.bind(expect);
expect.addFormatter = addFormatter.bind(expect);

expect.anything = anything;
expect.any = any;
expect.stringMatching = stringMatching;
expect.objectWith = objectWith;

expect.format = format.bind(expect);
