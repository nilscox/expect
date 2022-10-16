import expect, { AssertionFailed } from '@nilscox/expect';

import { isTodo, Todo } from './src/todo';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeCompleted(): void;
    }
  }
}

export const mochaHooks = {
  beforeAll() {
    expect.addAssertion({
      name: 'toBeCompleted',

      expectedType: 'a Todo',
      guard: isTodo,

      assert(todo) {
        if (todo.completedAt === undefined) {
          throw new AssertionFailed();
        }
      },

      getMessage(todo) {
        let message = 'expected todo';

        message += ` ${this.formatValue(todo.text)}`;

        if (this.not) {
          message += ' not';
        }

        message += ' to be completed';

        if (this.not) {
          message += ' but is';
        } else {
          message += ' but it is not';
        }

        return message;
      },
    });
  },
};
