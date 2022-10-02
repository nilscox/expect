import { expect } from './expect';

import './assertions/to-be-close-to';
import './assertions/to-be-defined';
import './assertions/to-be-less-than';
import './assertions/to-be-more-than';
import './assertions/to-be-undefined';
import './assertions/to-be';
import './assertions/to-equal';
import './assertions/to-have-been-called-with';
import './assertions/to-have-property';
import './assertions/to-match';
import './assertions/to-reject';
import './assertions/to-throw';

export default expect;
export type Expect = typeof expect;

export { AssertionError } from './errors/assertion-error';
export type { ValueFormatter } from './helpers/format-value';
