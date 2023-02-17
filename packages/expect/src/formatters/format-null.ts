import { expect } from '../expect';

const isNull = (value: unknown): value is null => {
  return value === null;
};

expect.addFormatter(isNull, () => 'null');
