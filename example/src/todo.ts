export type Todo = {
  text: string;
  completedAt?: Date;
};

export const createTodo = (text: string): Todo => ({
  text,
});

export const completeTodo = (todo: Todo) => {
  if (todo.completedAt !== undefined) {
    throw new Error('todo already completed');
  }

  todo.completedAt = new Date();
};

export const isTodo = (value: any): value is Todo => {
  return [
    value,
    typeof value.text === 'string',
    value.completedAt === undefined || value.completedAt instanceof Date,
  ].every(Boolean);
};
