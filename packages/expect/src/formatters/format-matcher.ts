import { expect } from '../expect';
import { isMatcher } from '../helpers/create-matcher';

expect.addFormatter(isMatcher, function (matcher) {
  return this.inspect(matcher);
});
