import React, { useRef, useState } from 'react';
import FormSelect, { FormSelectProps } from 'azrmui/core/FormInputs/FormOutlinedSelect';
import useStateWithError from '../useStateWithError';

const t1Preset : FormSelectProps = {
  margin: 'dense',
  fullWidth: true,
};

export default function useTextField(
  initialState: any | (() => any),
  initialError: string | (() => string) = '',
  porps: FormSelectProps & {
    azpreset?: 't1'
  },
) {
  const [value, setValue, error, setError] = useStateWithError<any>(initialState, initialError);
  const { azpreset = 't1', ...p } = porps;
  const render = (porps2?: FormSelectProps) => (
    <FormSelect
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
