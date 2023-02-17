import { AssertionDefinition, AssertionDefinitions, AssertionNames } from './expect-types';

declare global {
  namespace Expect {
    interface ExpectFunction {
      _assertions: AssertionDefinitions;

      addAssertion<Name extends AssertionNames, Subject, Value, Meta>(
        assertion: AssertionDefinition<Name, Subject, Value, Meta>
      ): void;
    }
  }
}

export const addAssertion = function <Name extends AssertionNames, Subject, Value, Meta>(
  this: Expect.ExpectFunction,
  assertion: AssertionDefinition<Name, Subject, Value, Meta>
) {
  if (assertion.name in this._assertions) {
    throw new Error(`cannot add assertion "${assertion.name}" because it already exits`);
  }

  this._assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};
