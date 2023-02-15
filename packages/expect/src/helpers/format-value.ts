import util, { InspectOptions } from 'util';
import { isMatcher } from './create-matcher';

export type ValueFormatter = (value: unknown, options?: InspectOptions) => string;

// format dom elements
export const formatValue: ValueFormatter = (value, options) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'object') {
    if (value == null) {
      return `[${value}]`;
    }

    if (Array.isArray(value)) {
      return `[${value.map((value) => formatValue(value, options)).join(', ')}]`;
    }

    if (value instanceof Error) {
      return `[${value.constructor.name}: ${value.message}]`;
    }

    return util.inspect(value, options);
  }

  if (isMatcher(value)) {
    return util.inspect(value, options);
  }

  if (typeof value === 'function') {
    if (value.name) {
      return `[function ${value.name}]`;
    }

    return '[anonymous function]';
  }

  return String(value);
};
