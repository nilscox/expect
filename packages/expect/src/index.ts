import { expect } from './expect';

import './assertions/to-be-close-to';
import './assertions/to-be-defined';
import './assertions/to-be-less-than';
import './assertions/to-be-more-than';
import './assertions/to-be';
import './assertions/to-equal';
import './assertions/to-have-length';
import './assertions/to-have-property';
import './assertions/to-include';
import './assertions/to-match';
import './assertions/to-reject';
import './assertions/to-reject-with';
import './assertions/to-resolve';
import './assertions/to-throw';

import './formatters/format-object';
import './formatters/format-function';
import './formatters/format-matcher';
import './formatters/format-error';
import './formatters/format-array';
import './formatters/format-string';
import './formatters/format-number';
import './formatters/format-boolean';
import './formatters/format-null';
import './formatters/format-undefined';

export default expect;
export type Expect = typeof expect;

export { AssertionFailed, assertion } from './errors/assertion-failed';

export { createMatcher } from './helpers/create-matcher';
export { testError } from './helpers/test-error';
