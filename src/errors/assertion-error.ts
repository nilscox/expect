import { ExpectError } from "./expect-error";

export class AssertionError<Actual = unknown> extends ExpectError {
  constructor(public readonly assertion: string, public readonly actual: Actual) {
    super("assertion error");
  }
}
