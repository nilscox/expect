import expect from '@nilscox/expect';

import { Todo } from './todo';

describe('todo', () => {
  it('creates a new todo', () => {
    const todo = new Todo('Buy beers');

    expect(todo.toJSON()).toEqual({
      text: 'Buy beers',
      isCompleted: false,
      completedAt: undefined,
    });
  });

  it('marks a todo as completed', () => {
    const todo = new Todo('Buy beers');

    todo.complete();

    expect(todo).toHaveProperty('completedAt', expect.any(Date));
  });

  it('fails when the todo is already completed', () => {
    const todo = new Todo('Buy beers');

    todo.completedAt = new Date();

    expect(() => todo.complete()).toThrow(expect.stringMatching(/already completed/));
  });

  it('custom assertion', () => {
    const todo = new Todo('Buy beers');

    todo.complete();

    expect(todo).toBeCompleted();
  });

  it('custom matcher', () => {
    const todo = new Todo('Buy beers');

    todo.complete();

    expect([todo]).toInclude(expect.completedTodo());
  });

  it('assertion error', () => {
    const todo = new Todo('Buy beers');

    expect(todo.toJSON()).toEqual({
      text: 'Buy shoes',
      isCompleted: true,
      completedAt: undefined,
    });
  });
});
