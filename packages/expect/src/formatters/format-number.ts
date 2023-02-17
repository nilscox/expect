import { expect } from '../expect';
import { isNumber } from '../utils/guards';

expect.addFormatter(isNumber, (value) => {
  return String(value);
});
