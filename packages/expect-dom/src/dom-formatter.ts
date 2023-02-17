import expect from '@nilscox/expect';

const isHTMLElement = (value: unknown): value is HTMLElement => {
  return value instanceof HTMLElement;
};

export const setupDOMFormatter = (format: (node?: HTMLElement) => string | false) => {
  expect.addFormatter(isHTMLElement, (value) => '\n' + String(format(value)));
};
