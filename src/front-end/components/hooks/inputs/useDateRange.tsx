import React, { useRef, useState } from 'react';
import moment from 'moment';
import DateRangeInput from '../../DateRangeInput';
import useStateWithError from '../useStateWithError';

export type DateRangeProps = any;

export type ValueType = [any, any];

const t1Preset : DateRangeProps = {
  fullWidth: true,
  buttonProps: {
    margin: 'dense',
  },
  rangeInpuProps: {
    PickerProps: { ampm: false, margin: 'dense' },
    Picker1Props: { initialFocusedDate: moment().startOf('day') },
    Picker2Props: { initialFocusedDate: moment().startOf('day').add(18, 'hours') },
  },
};

export default function useTextField(
  initialState: ValueType | (() => ValueType),
  initialError: string | (() => string) = '',
  porps: DateRangeProps & {
    azpreset?: 't1'
  },
) {
  const [value, setValue, error, setError] = useStateWithError<ValueType>(initialState, initialError);
  const { azpreset = 't1', ...p } = porps;
  const render = (porps2?: DateRangeProps) => (
    <DateRangeInput
      {...p}
      {...t1Preset}
      // error={!!error}
      // helperText={error}
      value={value}
      onChange={setValue}
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
