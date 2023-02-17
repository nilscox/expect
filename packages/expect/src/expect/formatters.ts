import util from 'util';
import { ExpectError } from '../errors/expect-error';
import { ValueFormatter, ValueFormatterOptions } from '../helpers/message-formatter';

type FormatContext = { formatValue: ValueFormatter; inspect: ValueFormatter };
type Format<T> = (this: FormatContext, value: T) => string;

type Formatter<T> = {
  predicate: (value: unknown) => value is T;
  format: Format<T>;
};

declare global {
  namespace Expect {
    interface ExpectFunction {
      format: ValueFormatter;

      _formatters: Formatter<any>[];
      addFormatter<T>(predicate: (value: unknown) => value is T, format: Format<T>): void;
    }
  }
}

export const addFormatter: Expect.ExpectFunction['addFormatter'] = function (
  this: Expect.ExpectFunction,
  predicate,
  format
) {
  this._formatters.unshift({ predicate, format });
};

const defaultOptions: ValueFormatterOptions = {
  colors: true,
};

export const format: Expect.ExpectFunction['format'] = function (
  this: Expect.ExpectFunction,
  value,
  options
) {
  const inspect: ValueFormatter = (value, overrides) => {
    return util.inspect(value, { ...defaultOptions, ...options, ...overrides });
  };

  for (const { predicate, format } of this._formatters) {
    if (predicate(value)) {
      return format.call({ inspect, formatValue: this.format }, value);
    }
  }

  // should not happen
  throw new ExpectError('No formatter found for type ' + typeof value, { value });
};
