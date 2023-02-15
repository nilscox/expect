import util from 'util';
import { isMatcher } from './create-matcher';

export type ValueFormatter = (value: unknown) => string;

// format matchers, dom elements
export const formatValue: ValueFormatter = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'object') {
    if (value == null) {
      return `[${value}]`;
    }

    if (Array.isArray(value)) {
      return `[${value.map(formatValue).join(', ')}]`;
    }

    if (value instanceof Error) {
      return `[${value.constructor.name}: ${value.message}]`;
    }

    return util.inspect(value);
  }

  if (isMatcher(value)) {
    return util.inspect(value);
  }

  if (typeof value === 'function') {
    if (value.name) {
      return `[function ${value.name}]`;
    }

    return '[anonymous function]';
  }

  return String(value);
};
