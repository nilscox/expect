import { AnyAssertionDefinition } from '../expect/expect-types';
import { ExpectError } from './expect-error';

export class UnexpectedPromise extends ExpectError {
  constructor(assertion: AnyAssertionDefinition) {
    super(
      `expect(actual).${assertion.name}(): actual must not be a promise, use expect.async(actual) instead`
    );
  }
}
