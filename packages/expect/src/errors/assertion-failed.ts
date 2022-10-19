import { ExpectError } from './expect-error';

export class AssertionFailed<Meta = unknown> extends ExpectError {
  public expected?: unknown;
  public actual?: unknown;
  public not?: boolean;
  public meta?: Meta;

  constructor(options: { expected?: unknown; actual?: unknown; meta?: Meta } = {}) {
    super('assertion failed');
    Object.assign(this, options);
  }
}
