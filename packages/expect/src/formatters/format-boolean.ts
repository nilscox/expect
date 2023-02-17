import { expect } from '../expect';
import { isBoolean } from '../utils/guards';

expect.addFormatter(isBoolean, function (value) {
  return this.inspect(value);
});
