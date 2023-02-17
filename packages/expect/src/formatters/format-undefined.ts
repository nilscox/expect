import { expect } from '../expect';
import { isUndefined } from '../utils/guards';

expect.addFormatter(isUndefined, () => 'undefined');
