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
      && editingSource.userOrganization.labels
      && editingSource.userOrganization.labels.identifier
    )
    || defaultText
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => onSubmit({
    // ...editingSource,
    username,
    password,
    name: identifier,
    identifier: identifier || '',
  });

  const fields = editingSource ? (
    <React.Fragment>
      <FormTextField
        label="電子信箱"
        value={editingSource.data.email}
        disabled
        margin="dense"
        fullWidth
      />
      <FormTextField
        label="識別名稱"
        value={identifier || ''}
        onChange={e => setIdentifier(e.target.value)}
        autoFocus
        margin="dense"
        fullWidth
      />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <FormTextField
        label="帳號名稱"
        value={username}
        onChange={e => setUsername(e.target.value)}
        margin="dense"
        fullWidth
      />
      <FormSpace variant="content2" />
      <FormTextField
        label="密碼"
        value={password}
        onChange={e => setPassword(e.target.value)}
        margin="dense"
        fullWidth
      />
      <FormSpace variant="content2" />
      <FormTextField
        label="識別名稱"
        value={identifier || ''}
        onChange={e => setIdentifier(e.target.value)}
        margin="dense"
        fullWidth
      />
    </React.Fragment>
  );

  return (
    <DialogContent>
      {fields}
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
          {editingSource ? '更新' : '新增'}
        </Button>
      </div>
    </DialogContent>
  );
};
