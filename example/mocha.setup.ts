import expect, { assertion, createMatcher } from '@nilscox/expect';
import { RootHookObject } from 'mocha';

import '@nilscox/expect-dom';
import '@nilscox/expect-sinon';

import { setupDOMFormatter } from '@nilscox/expect-dom';
import { prettyDOM } from '@testing-library/dom';
import { Todo } from './src/todo';

setupDOMFormatter(prettyDOM);

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
        return this.formatter.expected(error.subject).not.append('to be completed').result();
      },
    });

    expect.addMatcher('completedTodo', completedTodo);

    expect.addFormatter(Todo.isTodo, function (todo) {
      return `todo ${this.formatValue(todo.text)}`;
    });
  },
};
