import React, { useRef, useState } from 'react';
import FormSwitch, { FormSwitchProps } from 'azrmui/core/FormInputs/FormSwitch';
import useStateWithError from '../useStateWithError';

const t1Preset : FormSwitchProps = {
  // margin: 'dense',
  // fullWidth: true,
};

export default function useTextField(
  initialState: boolean | (() => boolean),
  initialError: boolean | (() => boolean) = false,
  porps: FormSwitchProps & {
    azpreset?: 't1'
  },
) {
  const [value, setValue, error, setError] = useStateWithError<boolean>(initialState, initialError);
  const { azpreset = 't1', ...p } = porps;
  const render = (porps2?: FormSwitchProps) => (
    <FormSwitch
      {...p}
      {...t1Preset}
      value={value}
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
