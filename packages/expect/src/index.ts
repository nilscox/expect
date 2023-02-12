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

export default expect;
export type Expect = typeof expect;

export { AssertionFailed } from './errors/assertion-failed';

export { createMatcher } from './helpers/create-matcher';

export { testError } from './test/test-error';
