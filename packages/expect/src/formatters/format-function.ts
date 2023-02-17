import { expect } from '../expect';
import { isFunction } from '../utils/guards';

expect.addFormatter(isFunction, function (func) {
  if (func.name) {
    return `[function ${func.name}]`;
  }

  return '[anonymous function]';
});
