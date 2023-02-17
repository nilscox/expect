import { isString } from '../errors/guard-error';
import { expect } from '../expect';
import { styles } from '../helpers/styles';

const quote = styles.dim('"');

expect.addFormatter(isString, (value) => {
  return [quote, value, quote].join('');
});
