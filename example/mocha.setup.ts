import expect, { AssertionFailed, createMatcher } from '@nilscox/expect';
import { RootHookObject } from 'mocha';

import { Todo } from './src/todo';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeCompleted(): void;
    }

    export interface CustomMatchers {
      completedTodo: typeof completedTodo;
    }
  }
}

const completedTodo = createMatcher((value: Todo) => {
  return value.completedAt !== undefined;
});

export const mochaHooks: RootHookObject = {
  afterAll() {
    expect.cleanup();
  },

  beforeAll() {
    // mocha clears the require cache in watch mode or something like that
    const TodoRequire: typeof Todo = require('./src/todo').Todo;

    expect.addCustomAssertion({
      name: 'toBeCompleted',

      expectedType: 'a Todo',
      guard: TodoRequire.isTodo,

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

    expect.addCustomMatcher('completedTodo', completedTodo);
  },
};
