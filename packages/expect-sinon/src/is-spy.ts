export const isSpy = (actual: unknown): actual is sinon.SinonSpy => {
  return typeof actual === 'function' && actual != null && 'called' in actual;
};
