import expect, { assertion, createMatcher } from '@nilscox/expect';
import { RootHookObject } from 'mocha';

import { Todo } from './src/todo';

declare global {
  namespace Expect {
    export interface TodoAssertions extends ObjectAssertions<Todo> {
      toBeCompleted(): void;
    }

    export interface Assertions extends TodoAssertions {}

    interface ExpectFunction {
      <Actual extends Todo>(actual: Actual): ExpectResult<TodoAssertions, Actual>;
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
  beforeAll() {
    expect.addAssertion({
      name: 'toBeCompleted',

      expectedType: 'a Todo',
      guard: Todo.isTodo,

      prepare(todo) {
        return {
          actual: todo.completedAt,
          meta: {
            text: todo.text,
          },
        };
      },

      assert(completedAt) {
        assertion(completedAt !== undefined);
      },

      getMessage(error) {
        let message = 'expected todo';

        message += ` ${this.formatValue(error.meta.text)}`;

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

    expect.addMatcher('completedTodo', completedTodo);
  },
};
