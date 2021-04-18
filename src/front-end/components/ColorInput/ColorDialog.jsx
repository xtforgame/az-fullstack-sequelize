/* eslint-disable react/prop-types, react/forbid-prop-types */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SketchPicker } from 'react-color';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import ConfirmDialog from 'azrmui/core/Dialogs/ConfirmDialog';
import { FormTextField, FormSpace } from 'azrmui/core/FormInputs';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import colorNames, { findNameInfo } from './colorNames';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
}));

export default (props) => {
  const {
    normalize = v => v,
    label,
    value,
    i18nNs = [],
    onClose = () => undefined,
    onExited,
    RangeInput,
    rangeInpuProps,
    onChange = () => {},
    ...rest
  } = props;

  const classes = useStyles();

  const [checked, setChecked] = useState(true);
  const { t } = useTranslation(['builtin-components']);

  const toggleChecked = () => {
    setChecked(prev => !prev);
  };

  const handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      result = value;
    } else {
      result = undefined;
    }
    onClose(result);
  };

  return (
    <ConfirmDialog
      {...rest}
      onClose={handleClose}
      dialogProps={{ onExited }}
      buttonTexts={{
        yes: t('confirmOK'),
        no: t('confirmCancel'),
      }}
    >
      <DialogContent>
        <div style={{ display: 'flex' }}>
          <FormTextField
            label="色彩名稱"
            // label={label}
            // onKeyPress={handleEnterForTextField}
            value={value[0]}
            onChange={(e) => {
              onChange([e.target.value, value[1]]);
            }}
            margin="dense"
            disabled={checked}
            fullWidth
          />
          <FormControlLabel
            value="start"
            control={(
              <Switch
                color="primary"
                checked={checked}
                onChange={() => {
                  if (!checked) {
                    const nameInfo = findNameInfo(value[1].r, value[1].g, value[1].b);
                    onChange([nameInfo.zhTw, value[1]]);
                  }
                  toggleChecked();
                }}
              />
            )}
            label="自動辨色"
            labelPlacement="start"
          />
        </div>
        <FormSpace variant="content1" />
        <SketchPicker
          // width="100%"
          triangle="hide"
          styles={{
            picker: {
              boxShadow: 'unset',
            },
          }}
          colors={[
            '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF',
          ]}
          color={value[1]}
          onChangeComplete={(c) => {
            const nameInfo = findNameInfo(c.rgb.r, c.rgb.g, c.rgb.b);
            if (checked) {
              onChange([nameInfo.zhTw, c.rgb]);
            } else {
              onChange([value[0], c.rgb]);
            }
          }}
        />
      </DialogContent>
    </ConfirmDialog>
  );
};
