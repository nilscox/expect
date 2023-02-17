import { expect } from '../expect';
import { isArray } from '../utils/guards';

expect.addFormatter(isArray, (values) => {
  return `[${values.map((value) => expect.format(value)).join(', ')}]`;
});
