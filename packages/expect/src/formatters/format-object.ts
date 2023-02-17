import { expect } from '../expect';

const isObject = (value: unknown): value is object => {
  return typeof value === 'object';
};

expect.addFormatter(isObject, function (value) {
  return this.inspect(value);
});
