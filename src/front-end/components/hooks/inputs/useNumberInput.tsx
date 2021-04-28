import React, { useRef, useState } from 'react';
import FormNumberInput, { FormNumberInputProps } from 'azrmui/core/FormInputs/FormNumberInput';
import useStateWithError from '../useStateWithError';

const t1Preset : FormNumberInputProps = {
  margin: 'dense',
  fullWidth: true,
};

export default function useTextField(
  initialState: string | (() => string),
  initialError: string | (() => string) = '',
  porps: FormNumberInputProps & {
    azpreset?: 't1'
  },
) {
  const [value, setValue, error, setError] = useStateWithError<string>(initialState, initialError);
  const { azpreset = 't1', ...p } = porps;
  const render = (porps2?: FormNumberInputProps) => (
    <FormNumberInput
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
