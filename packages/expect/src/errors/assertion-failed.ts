import { AssertionError } from 'assert';

export class AssertionFailed<Meta = unknown> extends AssertionError {
  public not?: boolean;
  public meta?: Meta;

  constructor(options: { expected?: unknown; actual?: unknown; meta?: Meta } = {}) {
    super({
      message: 'Assertion failed',
      expected: options.expected,
      actual: options.actual,
    });

    this.meta = options.meta;
  }
}
