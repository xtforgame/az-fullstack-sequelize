import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import { FormTextField, FormSpace } from '~/components/FormInputs';

const useStyles = makeStyles(theme => ({
}));

export default (props) => {
  const {
    editingParams: {
      defaultText,
      editingSource,
    },
    // onDone,
    onCancel,
    onSubmit,
  } = props;

  const [identifier, setIdentifier] = useState(
    (
      editingSource
      && editingSource.labels
      && editingSource.labels.identifier
    )
    || defaultText
  );
  const submit = () => onSubmit({
    ...editingSource,
    identifier: identifier || '',
  });

  return (
    <DialogContent>
      <FormTextField
        label="識別名稱"
        value={identifier || ''}
        onPressEnter={submit}
        onChange={e => setIdentifier(e.target.value)}
        autoFocus
        margin="dense"
        fullWidth
      />
      <FormSpace variant="content2" />
      <div style={{ display: 'flex' }}>
        <Button
          variant="contained"
          onClick={onCancel}
        >
          取消
        </Button>
        <div style={{ flex: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={submit}
        >
          更新
        </Button>
      </div>
    </DialogContent>
  );
};
