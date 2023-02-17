import { expect } from '../expect';

const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

expect.addFormatter(isUndefined, () => 'undefined');
