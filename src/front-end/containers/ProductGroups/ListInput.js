/* eslint-disable react/prop-types, react/forbid-prop-types */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import uuidv4 from 'uuid/v4';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@material-ui/icons/RemoveCircleOutlined';
import TextFieldFrame from 'azrmui/core/TextFieldFrame';
import ListInputCore from './ListInputCore';

const Content = ({
  inputRef, display, ...props
}) => (
  <div
    style={{
      width: '100%', height: 'auto', maxHeight: 600, overflowY: 'auto',
    }}
  >
    <ListInputCore {...props} />
  </div>
);

export const newItemId = Symbol('new-item');

export default ({
  newItem = () => ({}),
  display = item => item.data,
  onChange,
  ...props
}) => {
  const { t } = useTranslation(['builtin-components']);

  return (
    <React.Fragment>
      <TextFieldFrame
        onChange={onChange}
        {...props}
        value=" "
        Content={Content}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          display,
          ...props,
        }}
      />
    </React.Fragment>
  );
};
