import util from 'util';
import { AssertionError } from 'assert';
import { styles } from '../helpers/styles';

export class AssertionFailed<Meta = unknown> extends AssertionError {
  public subject!: unknown;
  public meta!: Meta;

  constructor(public readonly hint?: unknown) {
    super({
      message: 'Assertion failed',
    });

    // https://github.com/microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, new.target.prototype);
  }

  [util.inspect.custom]() {
    if (!this.stack) {
      return this.message;
    }

    const stack = this.stack
      .split('\n')
      .filter((line) => !line.match(/@nilscox\/expect/))
      .join('\n');

    return [this.message, styles.dim(stack)].join('\n');
  }
}

export function assertion(condition: unknown, hint?: unknown): asserts condition {
  if (!condition) {
    throw new AssertionFailed(hint);
  }
}
