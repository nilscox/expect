import { AssertionError } from 'assert';

export class AssertionFailed<Meta = unknown> extends AssertionError {
  public subject!: unknown;
  public meta!: Meta;

  constructor(public readonly hint?: unknown) {
    super({
      message: 'Assertion failed',
    });

    // https://github.com/microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, new.target.prototype);

    this.stack = this.stack
      ?.split('\n')
      .filter((line) => !line.match(/@nilscox\/expect|assert\/assertion_error/))
      .join('\n');
  }
}

export function assertion(condition: unknown, hint?: unknown): asserts condition {
  if (!condition) {
    throw new AssertionFailed(hint);
  }
}
