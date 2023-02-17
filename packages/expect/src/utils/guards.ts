export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined => value === undefined;
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isNumber = (value: unknown): value is number => typeof value === 'number';
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isObject = (value: unknown): value is object => typeof value === 'object';
export const isFunction = (value: unknown): value is Function => typeof value === 'function';
export const isArray = (value: unknown): value is Array<unknown> => Array.isArray(value);
