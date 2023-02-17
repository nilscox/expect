import { isFunction } from '../errors/guard-error';
import { expect } from '../expect';

expect.addFormatter(isFunction, function (func) {
  if (func.name) {
    return `[function ${func.name}]`;
  }

  return '[anonymous function]';
});
