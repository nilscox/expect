import { AnyAssertion } from '../expect';
import { ExpectError } from './expect-error';

export class ExpectedPromise extends ExpectError {
  constructor(assertion?: AnyAssertion) {
    let message = 'expect';

    if (assertion) {
      message += `.async(actual).${assertion.name}()`;
    } else {
      message += `.rejects(actual).with()`;
    }

    message += ': actual must be a promise, use expect(actual) instead';

    super(message);
  }
}
