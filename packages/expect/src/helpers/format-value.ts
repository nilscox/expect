import { isMatcher } from './create-matcher';

export type ValueFormatter = (value: unknown) => string;

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

    if (value.constructor === Object) {
      return JSON.stringify(value, (key, value) => {
        if (isMatcher(value)) {
          return value.toString();
        }

        return value;
      });
    }

    if (value instanceof Error) {
      return `[${value.constructor.name}: ${value.message}]`;
    }

    return String(value);
  }

  if (isMatcher(value)) {
    return value.toString();
  }

  if (typeof value === 'function') {
    if (value.name) {
      return `[function ${value.name}]`;
    }

    return '[anonymous function]';
  }

  return String(value);
};
