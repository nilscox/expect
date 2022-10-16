import expect from '@nilscox/expect';

import { completeTodo, createTodo, Todo } from './todo';

describe('todo', () => {
  it('creates a new todo', () => {
    const todo = createTodo('Buy beers');

    expect(todo).toEqual({
      text: 'Buy beers',
      completedAt: undefined,
    });
  });

  it('marks a todo as completed', () => {
    const todo = createTodo('Buy beers');

    completeTodo(todo);

    expect(todo).toHaveProperty('completedAt', expect.any(Date));
  });

  it('fails when the todo is already completed', () => {
    const todo = createTodo('Buy beers');

    todo.completedAt = new Date();

    expect(() => completeTodo(todo)).toThrow(expect.stringMatching(/already completed/));
  });

  it('custom assertion', () => {
    const todo = createTodo('Buy beers');

    completeTodo(todo);

    expect(todo).toBeCompleted();
  });
});
