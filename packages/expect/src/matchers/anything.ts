import { createMatcher } from '../helpers/create-matcher';

export const anything = createMatcher<any, []>(
  () => true,
  () => 'anything'
);
