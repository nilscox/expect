import './to-have-been-called';
import './to-have-been-called-with';

declare global {
  namespace Expect {
    interface SinonSpyAssertions<Actual extends sinon.SinonSpy> {}

    interface Assertions extends SinonSpyAssertions<any> {}

    interface ExpectFunction {
      <Actual extends sinon.SinonSpy>(actual: Actual): ExpectResult<Expect.SinonSpyAssertions<Actual>, Actual>;
    }
  }
}
