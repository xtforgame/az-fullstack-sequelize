/* eslint-disable react/prop-types, react/forbid-prop-types, react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import Clear from '@material-ui/icons/Clear';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import FormTextField, { FormTextFieldProps } from 'azrmui/core/FormInputs/FormTextField';
import { promiseWait } from 'common/utils';

export type FormPasswordFieldProps = FormTextFieldProps & {
  submit?: (value: any) => Promise<any>;
};

const useStyles = makeStyles(theme => ({
  inputAdornment: {
    paddingRight: 4,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    // margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  iconButtonProgres: {
    color: green[500],
    position: 'absolute',
    top: -4,
    left: -4,
    zIndex: 1,
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
}));

const noSuccessOnValue = Symbol('noSuccessOnValue');

export default (props : FormPasswordFieldProps) => {
  const {
    value: valueFromProps,
    submit = async () => Promise.reject(new Error('no submit function')),
    // submit = async (val) => {
    //   await promiseWait(3000);
    //   return Promise.resolve(val);
    // },
    ...rest
  } = props;
  const classes = useStyles();
  const [updatedValue, setUpdatedValue] = useStateWithError(valueFromProps || '');
  const [value, setValue, valueError, setValueError] = useStateWithError(updatedValue);
  const [successOnValue, setSuccessOnValue] = useStateWithError(noSuccessOnValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedValue(valueFromProps || '');
    setValue(valueFromProps || '');
  }, [valueFromProps]);

  useEffect(() => {
    if (successOnValue !== value) {
      setSuccessOnValue(noSuccessOnValue);
    }
  }, [value]);

  const success = successOnValue === value;
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  const endAdornment = (
    <InputAdornment position="end">
      {value !== updatedValue && (
        <IconButton
          // tabIndex="-1"
          size="small"
          onClick={() => setValue(updatedValue)}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <Clear />
        </IconButton>
      )}
      {(success || loading || value !== updatedValue) && (
        <IconButton
          // tabIndex="-1"
          size="small"
          className={buttonClassname}
          onClick={async () => {
            setLoading(true);
            try {
              const v = await submit(value);
              setValue(v || '');
              setUpdatedValue(v || '');
              setSuccessOnValue(v || '');
            } catch (error) {
              const errorString = typeof error === 'string' ? error : error.message;
              setValueError(errorString);
            }
            setLoading(false);
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          {success ? <CheckIcon style={{ color: 'white' }} /> : <SaveIcon />}
          {loading && <CircularProgress size={38} className={classes.iconButtonProgres} />}
        </IconButton>
      )}
      {/* <div className={classes.wrapper}>
        <IconButton
          // tabIndex="-1"
          size="small"
          onClick={() => submit(value)}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <SaveIcon />
        </IconButton>
        {loading && <CircularProgress size={38} className={classes.iconButtonProgres} />}
      </div> */}
      {/* <div className={classes.wrapper}>
        <Fab
          aria-label="save"
          color="primary"
          size="small"
          className={buttonClassname}
          onClick={() => submit(value)}
        >
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && <CircularProgress size={52} className={classes.fabProgress} />}
      </div> */}
    </InputAdornment>
  );
  return (
    <FormTextField
      error={!!valueError}
      helperText={valueError}
      value={value}
      onChange={e => setValue(e.target.value)}
      InputProps={{
        className: classes.inputAdornment,
        endAdornment,
      }}
      {...rest}
      disabled={rest.disabled || loading}
    />
  );
};
