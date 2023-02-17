This is the documentation for an assertion library's code related to the DOM. The full library is divided into three packages, take a look at [the main readme](../../../../) for more information.

This package contains assertions on DOM elements, like `.toBeDisabled()` or `.toHaveValue()`. To use them, just import this package in your test's global setup file, like mocha's root hook.

It also includes a helper function allowing to set a custom formatter to print HTML elements in a convenient way.

```ts
import { setupDOMFormatter } from '<this package>';

setupDOMFormatter((element) => element.tagName);
```

This helper can be use with `@testing-library/dom`'s [prettyDOM](https://testing-library.com/docs/dom-testing-library/api-debugging#prettydom) function.

```ts
import { setupDOMFormatter } from '<this package>';
import { prettyDOM } from '@testing-library/dom';

setupDOMFormatter(prettyDOM);
```

## API Reference

- [toBeDisabled](#tobedisabled)
- [toBeVisible](#tobevisible)
- [toHaveErrorMessage](#tohaveerrormessage)
- [toHaveTextContent](#tohavetextcontent)
- [toHaveValue](#tohavevalue)

### toBeDisabled

Assert that an element is disabled.

```ts
expect(element: HTMLElement).toBeDisabled(): void
```

### toBeVisible

Assert that an element is visible. An element is concerned visible if all of the following are true:

- it's `display` style is not `none`
- it's `visibility` style is neither `hidden` nor `collapse`
- it's `opacity` style is not `0`

```ts
expect(element: HTMLElement).toBeVisible(): void
```

### toHaveErrorMessage

Assert that a element has a given error message. The element must have an `aria-invalid` set to `true`, and an `aria-errormessage` attribute set to the id an element containing the text of the error message.

```ts
expect(element: HTMLElement).toHaveErrorMessage(message?: string): void
```

### toHaveTextContent

Assert that an element contains a given text.

```ts
expect(element: HTMLElement).toHaveTextContent(text: string): void
```

### toHaveValue

Assert that a input has a given value.

```ts
expect(element: HTMLElement).toHaveValue(value: string): void
```
