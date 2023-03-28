import clsx from 'clsx';
import TextField from '@mui/material/TextField';
import { TextInput, useInput, InputHelperText } from 'react-admin';
import { useMemo } from 'react';

import { Cords, CordsList } from '@features/area/type';

const coordsToString = (coords?: CordsList): string =>
  Array.isArray(coords) ? coords.map((coord) => `${coord.lat},${coord.lon}`).join(`\n`) : '';

const stringToCords = (value: string): CordsList => {
  return value
    .split(`\n`)
    .filter((value) => value !== '')
    .map<Cords>((location) => {
      const coordinates = location.split(',');

      return { lat: parseFloat(coordinates[0]) || 0, lon: parseFloat(coordinates[1]) || 0 };
    });
};

export const RouteInput: typeof TextInput = ({
  className,
  defaultValue = [],
  format = coordsToString,
  helperText,
  label,
  onBlur,
  onChange,
  parse = stringToCords,
  resource,
  source,
  validate,
  ...rest
}): JSX.Element => {
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    defaultValue,
    format,
    parse,
    resource,
    source,
    type: 'text',
    validate,
    onBlur,
    onChange,
    ...rest,
  });

  const routeLength = useMemo(() => {
    return parse(field.value).length;
  }, [field.value]);

  return (
    <TextField
      {...field}
      className={clsx('ra-input', `ra-input-${source}`, className)}
      error={(isTouched || isSubmitted) && invalid}
      fullWidth
      multiline
      rows={10}
      helperText={<InputHelperText touched={isTouched || isSubmitted} error={error?.message} helperText={helperText} />}
      label={`${label} - ${routeLength} points`}
      required={isRequired}
      {...rest}
    />
  );
};
RouteInput.propTypes = TextInput.propTypes;
RouteInput.defaultProps = TextInput.defaultProps;
