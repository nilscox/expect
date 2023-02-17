import { isNumber } from '../errors/guard-error';
import { expect } from '../expect';

expect.addFormatter(isNumber, (value) => {
  return String(value);
});
