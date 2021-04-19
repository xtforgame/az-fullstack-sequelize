import React, { useRef, useState } from 'react';
import FormTextField, { FormTextFieldProps } from 'azrmui/core/FormInputs/FormTextField';
import useStateWithError from '../useStateWithError';

const t1Preset : FormTextFieldProps = {
  margin: 'dense',
  fullWidth: true,
};

export default function useTextField(
  initialState: string | (() => string),
  initialError: string | (() => string) = '',
  porps: FormTextFieldProps & {
    azpreset?: 't1'
  },
) {
  const [value, setValue, error, setError] = useStateWithError<string>(initialState, initialError);
  const { azpreset = 't1', ...p } = porps;
  const render = (porps2?: FormTextFieldProps) => (
    <FormTextField
      {...p}
      {...t1Preset}
      error={!!error}
      helperText={error}
      value={value}
      onChange={e => setValue(e.target.value)}
      {...porps2}
    />
  );
  return [
    [value, setValue, error, setError],
    {
      render,
    },
  ];
}
