export const formatter = new Intl.DateTimeFormat(navigator.language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  minute: 'numeric',
  hour: 'numeric',
});

export const formatDate = (date?: number) => (date ? formatter.format(date * 1000) : 'Never');

export const snakeToPascal = (str: string) =>
  str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
