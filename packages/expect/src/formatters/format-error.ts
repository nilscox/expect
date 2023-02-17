import { expect } from '../expect';

const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

expect.addFormatter(isError, (value) => {
  return `[${value.constructor.name}: ${value.message}]`;
});
