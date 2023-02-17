import { isArray } from '../errors/guard-error';
import { expect } from '../expect';

expect.addFormatter(isArray, (values) => {
  return `[${values.map((value) => expect.format(value)).join(', ')}]`;
});
