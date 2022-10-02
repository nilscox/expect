import { AnyAssertion } from '../expect';
import { ExpectError } from './expect-error';

export class UnexpectedPromise extends ExpectError {
  constructor(assertion: AnyAssertion) {
    super(
      `expect(actual).${assertion.name}(): actual must not be a promise, use expect.async(actual) instead`
    );
  }
}
