import { ExpectError } from './expect-error';

export class GuardError<Actual> extends ExpectError {
  constructor(
    public readonly assertion: string,
    public readonly actual: Actual,
    public readonly expectedType?: string
  ) {
    const message = expectedType
      ? `expect(actual).${assertion}(): actual must be ${expectedType}`
      : `expect(actual).${assertion}(): actual has invalid type`;

    super(message);
  }
}
