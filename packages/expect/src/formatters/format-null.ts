import { expect } from '../expect';
import { isNull } from '../utils/guards';

expect.addFormatter(isNull, function () {
  return this.inspect(null);
});
