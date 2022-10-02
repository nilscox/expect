import { ExpectError } from './expect-error';

export class GuardError<Actual> extends ExpectError {
  constructor(
    public readonly assertion: string,
    public readonly actual: Actual,
    public readonly expectedType?: string
  ) {
    const message = expectedType
      ? `expect(actual).${assertion}(): actual must be ${expectedType}`
      : `expect(actual).${assertion}(): actual has invalid type`;

    super(message);
  }
}

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isNumber = (value: unknown): value is number => typeof value === 'number';
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isFunction = (value: unknown): value is Function => typeof value === 'function';
