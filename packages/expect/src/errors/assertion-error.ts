import { ExpectError } from './expect-error';

export class AssertionError<Actual = unknown> extends ExpectError {
  constructor(
    message: string,
    public readonly assertion: string,
    public readonly actual: Actual,
    public readonly args: unknown[]
  ) {
    super(message);
  }
}
