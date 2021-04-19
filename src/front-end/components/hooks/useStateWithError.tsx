import { useState, SetStateAction } from 'react';

export const Cancel = Symbol('Cancel');

export type ResultType<S> = [
  S,
  (value: SetStateAction<S>, clearError?: boolean) => void,
  string,
  (value: SetStateAction<string>) => void,
];

export default function useStateWithError<S>(
  initialState: S | (() => S), initialError: string | (() => string) = '', config?,
) : ResultType<S> {
  const [value, setValue] = useState(initialState);
  const [error, setError] = useState(initialError);

  const sv = (value: SetStateAction<S>, clearError = true) => {
    setValue(value);
    if (clearError) {
      setError('');
    }
  };

  return [value, sv, error, setError];
}
