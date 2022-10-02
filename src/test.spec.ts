import assert from 'assert';

const expect = {
  async: (p: Promise<unknown>) => {
    return {
      async toEqual(expected: unknown) {
        assert.equal(await p, expected);
      },
    };
  },
};

it('test', async () => {
  const doSomething = async () => 42;

  await expect.async(doSomething()).toEqual(42);
});
