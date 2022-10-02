import { ExpectError } from './expect-error';

export class AssertionFailed<Meta = unknown> extends ExpectError {
  constructor(public readonly meta?: Meta) {
    super('assertion failed');
  }
}
