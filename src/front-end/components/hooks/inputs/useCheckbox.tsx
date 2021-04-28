import React, { useRef, useState } from 'react';
import FormCheckbox, { FormCheckboxProps } from 'azrmui/core/FormInputs/FormCheckbox';
import useStateWithError from '../useStateWithError';

const t1Preset : FormCheckboxProps = {
  // margin: 'dense',
  // fullWidth: true,
};

export default function useTextField(
  initialState: boolean | (() => boolean),
  initialError: boolean | (() => boolean) = false,
  porps: FormCheckboxProps & {
    azpreset?: 't1'
  },
) {
  const [value, setValue, error, setError] = useStateWithError<boolean>(initialState, initialError);
  const { azpreset = 't1', ...p } = porps;
  const render = (porps2?: FormCheckboxProps) => (
    <FormCheckbox
      {...p}
      {...t1Preset}
      checked={value}
      onChange={e => setValue(!value)}
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
