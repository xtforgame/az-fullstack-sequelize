import { useEffect, useState } from 'react';

export default (valueFromProps, options = {}) => {
  const [controlled] = useState(() => valueFromProps !== undefined);
  const [value, setValue] = useState(controlled ? valueFromProps : options.defaultValue);
  if (controlled) {
    useEffect(() => {
      let newValue = valueFromProps;
      if (options.handleChange) {
        newValue = options.handleChange(value, valueFromProps);
      }
      setValue(newValue);
    }, [valueFromProps]);
  }
  return [value, setValue];
};
