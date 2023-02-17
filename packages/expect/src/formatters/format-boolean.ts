import { isBoolean } from '../errors/guard-error';
import { expect } from '../expect';

expect.addFormatter(isBoolean, function (value) {
  return this.inspect(value);
});
