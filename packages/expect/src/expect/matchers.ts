import { isMatcher } from '../helpers/create-matcher';
import { any } from '../matchers/any';
import { anything } from '../matchers/anything';
import { objectWith } from '../matchers/object-with';
import { stringMatching } from '../matchers/string-matching';

interface BuiltinMatchers {
  anything: typeof anything;
  any: typeof any;
  stringMatching: typeof stringMatching;
  objectWith: typeof objectWith;
}

declare global {
  namespace Expect {
    interface CustomMatchers {}

    interface ExpectFunction extends BuiltinMatchers, CustomMatchers {
      _customMatchers: Set<string>;
      addMatcher(name: keyof CustomMatchers, matcher: unknown): void;
      addCustomMatcher(name: keyof CustomMatchers, matcher: unknown): void;
    }
  }
}

export const addMatcher: Expect.ExpectFunction['addMatcher'] = function (
  this: Expect.ExpectFunction,
  name,
  matcher
) {
  if (typeof matcher !== 'function' || !isMatcher(matcher())) {
    throw new Error(`cannot add matcher "${name}" because it is not a matcher`);
  }

  if (name in this) {
    throw new Error(`cannot add matcher "${name}" because expect.${name} already exits`);
  }

  Object.assign(this, {
    [name]: matcher,
  });
};

export const addCustomMatcher: Expect.ExpectFunction['addMatcher'] = function (
  this: Expect.ExpectFunction,
  name,
  matcher
) {
  this.addMatcher(name, matcher);
  this._customMatchers.add(name);
};

export const cleanupMatchers = function (this: Expect.ExpectFunction) {
  for (const prop of this._customMatchers) {
    delete this[prop as keyof typeof this];
  }

  this._customMatchers.clear();
};
