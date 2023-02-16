import { styles } from './styles';
import { formatValue } from './format-value';

type FormatterOptions = {
  not: boolean;
  maxInlineLength: number;
};

class MessageFormatter {
  private chunks: string[] = [];
  private refs: string[] = [];

  constructor(private readonly options: FormatterOptions) {}

  static create(options: FormatterOptions) {
    return new MessageFormatter(options);
  }

  result() {
    return [
      //
      this.chunks.join(' '),
      ...this.refs.map((value, index) => `#${index + 1}: ${value}`),
    ].join('\n\n');
  }

  expected(value: unknown) {
    return this.append('expected').value(value);
  }

  get not() {
    if (this.options.not) {
      this.chunks.push('not');
    }

    return this;
  }

  append(chunk: string) {
    this.chunks.push(styles.red(chunk));
    return this;
  }

  if(condition: boolean, branches: { then: string; else?: string }): this;

  if<T>(
    guard: (value: unknown) => value is T,
    value: unknown,
    branches: { then: (value: T) => string; else?: string }
  ): this;

  if(arg1: any, arg2: any, arg3?: any) {
    const guardOverload = <T>(
      guard: (value: unknown) => value is T,
      value: unknown,
      branches: { then: (value: T) => string; else?: string }
    ) => {
      if (guard(value)) {
        this.append(branches.then(value));
      } else if (branches.else !== undefined) {
        this.append(branches.else);
      }
    };

    const valueOverload = (condition: boolean, branches: { then: string; else?: string }) => {
      if (condition) {
        this.append(branches.then);
      } else if (branches.else !== undefined) {
        this.append(branches.else);
      }
    };

    if (typeof arg1 === 'function') {
      guardOverload(arg1, arg2, arg3);
    } else {
      valueOverload(arg1, arg2);
    }

    return this;
  }

  value(value: unknown) {
    this.chunks.push(this.formatValue(value));
    return this;
  }

  formatValue(value: unknown) {
    const formatted = styles.reset(formatValue(value));

    if (formatted.length <= this.options.maxInlineLength) {
      return formatted;
    } else {
      return styles.reset('#' + this.ref(formatValue(value, { compact: false, breakLength: 1 })));
    }
  }

  private ref = (value: string) => {
    return this.refs.push(value);
  };
}

export { type MessageFormatter };
export const messageFormatter = MessageFormatter.create;
