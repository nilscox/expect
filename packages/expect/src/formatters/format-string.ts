import { expect } from '../expect';
import { styles } from '../helpers/styles';
import { isString } from '../utils/guards';

const quote = styles.gray('"');

expect.addFormatter(isString, (value) => {
  return [quote, value, quote].join('');
});
