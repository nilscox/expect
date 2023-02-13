import { AssertionDefinition, AssertionDefinitions, AssertionNames } from './expect-types';

declare global {
  namespace Expect {
    interface ExpectFunction {
      _assertions: AssertionDefinitions;

      _customAssertions: Set<AssertionNames>;

      addAssertion<Name extends AssertionNames, Subject, Value, Meta>(
        assertion: AssertionDefinition<Name, Subject, Value, Meta>
      ): void;

      addCustomAssertion<Name extends AssertionNames, Subject, Value, Meta>(
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

export const addCustomAssertion = function <Name extends AssertionNames, Subject, Value, Meta>(
  this: Expect.ExpectFunction,
  assertion: AssertionDefinition<Name, Subject, Value, Meta>
) {
  this.addAssertion(assertion);
  this._customAssertions.add(assertion.name);
};

export const cleanupAssertion = function (this: Expect.ExpectFunction) {
  for (const assertion of Object.values(this._assertions)) {
    if (!this._customAssertions.has(assertion.name)) {
      continue;
    }

    delete this._assertions[assertion.name];
  }

  this._customAssertions.clear();
};
