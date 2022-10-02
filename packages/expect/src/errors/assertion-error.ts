import { ValueFormatter } from '../helpers/format-value';
import { ExpectError } from './expect-error';

export abstract class AssertionError<Actual = unknown> extends ExpectError {
  constructor(public readonly assertion: string, public readonly actual: Actual) {
    super('assertion error');
  }

  abstract format(formatValue: ValueFormatter): string;
}
