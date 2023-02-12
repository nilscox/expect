import './to-be-disabled';
import './to-be-visible';
import './to-have-value';
import './to-have-text-content';
import './to-have-error-message';

declare global {
  namespace Expect {
    interface HTMLElementAssertions<Actual extends HTMLElement> {}

    interface Assertions extends HTMLElementAssertions<any> {}

    interface ExpectFunction {
      <Actual extends HTMLElement>(actual: Actual): ExpectResult<Expect.HTMLElementAssertions<Actual>, Actual>;
    }
  }
}
