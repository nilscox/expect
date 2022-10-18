export class Todo {
  completedAt?: Date;

  constructor(public text: string) {}

  static isTodo(value: unknown): value is Todo {
    return value instanceof Todo;
  }

  complete() {
    if (this.completedAt !== undefined) {
      throw new Error('todo already completed');
    }

    this.completedAt = new Date();
  }

  toJSON() {
    return {
      text: this.text,
      isCompleted: this.completedAt !== undefined,
      completedAt: this.completedAt,
    };
  }
}
