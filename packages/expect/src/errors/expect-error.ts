export class ExpectError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
  }
}
