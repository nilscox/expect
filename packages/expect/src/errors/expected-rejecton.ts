import { ExpectError } from './expect-error';

export class ExpectedRejection extends ExpectError {
  constructor(resolvedValueFormatted: string) {
    super(`expected promise to reject but it resolved with ${resolvedValueFormatted}`);
  }
}
