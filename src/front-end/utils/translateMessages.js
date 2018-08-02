import React from 'react';
import formatMessage from './formatMessage';

const ValuesTranslatedMark = Symbol('ValuesTranslated');

const translateValueParts = (intl, messageDescriptors, values) => {
  if (values[ValuesTranslatedMark]) {
    return values;
  }
  let newValues = {};
  Object.keys(values).forEach((key) => {
    if (typeof values[key] !== 'string' && !React.isValidElement(values[key]) && values[key].key) {
      newValues = {
        ...newValues,
        ...translateValueParts(intl, messageDescriptors, values[key].values || {}),
      };
      newValues[key] = formatMessage(intl, messageDescriptors[values[key].key], newValues);
    } else {
      newValues[key] = values[key];
    }
  });
  newValues[ValuesTranslatedMark] = true;
  return newValues;
};

export default function translateMessages(intl, messageDescriptors, keys, values = {}) {
  const newValues = translateValueParts(intl, messageDescriptors, values);
  const result = {};
  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      result[key] = translateMessages(intl, messageDescriptors, key, {
        ...result,
        ...newValues,
      });
    });
    return result;
  }
  const key = keys;
  if (!messageDescriptors[key]) {
    throw new Error(`Key not found in translateMessages: ${key}`);
  }
  return formatMessage(intl, messageDescriptors[key], newValues);
}
