import { createMatcher } from '../helpers/create-matcher';

export const stringMatching = createMatcher(
  (value: string, regexp: RegExp) => {
    return regexp.test(value);
  },
  (regexp) => {
    return `a string matching ${regexp}`;
  }
);
