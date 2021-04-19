import { useEffect, useState } from 'react';

export default (valueFromProps, valueSetterFromProps, defaultValue) => {
  let dv = defaultValue;
  if (typeof dv !== 'function') {
    dv = () => defaultValue;
  }
  const [controlled] = useState(() => valueFromProps !== undefined && valueSetterFromProps);
  const [value, setValue] = useState(() => (controlled ? valueFromProps : dv()));
  if (controlled) {
    return [valueFromProps, valueSetterFromProps];
  }
  useEffect(() => {
    if (valueSetterFromProps) {
      valueSetterFromProps(value);
    }
  }, [value]);
  return [value, setValue];
};
