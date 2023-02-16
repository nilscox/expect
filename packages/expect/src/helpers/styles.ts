import util from 'util';

const style = (style: Style) => {
  const [a, b] = util.inspect.colors[style] as [number, number];
  return (text: string) => `\x1b[${a}m${text}\x1b[${b}m`;
};

export const styles = Object.keys(util.inspect.colors).reduce(
  (obj, key) => ({ ...obj, [key]: style(key as Style) }),
  {} as Record<Style, (text: string) => string>
);

type Style =
  | 'reset'
  | 'bold'
  | 'dim'
  | 'italic'
  | 'underline'
  | 'blink'
  | 'inverse'
  | 'hidden'
  | 'strikethrough'
  | 'doubleunderline'
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'bgBlack'
  | 'bgRed'
  | 'bgGreen'
  | 'bgYellow'
  | 'bgBlue'
  | 'bgMagenta'
  | 'bgCyan'
  | 'bgWhite'
  | 'framed'
  | 'overlined'
  | 'gray'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright'
  | 'bgGray'
  | 'bgRedBright'
  | 'bgGreenBright'
  | 'bgYellowBright'
  | 'bgBlueBright'
  | 'bgMagentaBright'
  | 'bgCyanBright'
  | 'bgWhiteBright';
