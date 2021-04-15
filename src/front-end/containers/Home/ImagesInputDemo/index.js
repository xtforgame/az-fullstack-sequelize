import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CrudDialogEx from 'azrmui/core/Dialogs/CrudDialogEx';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import { FormImagesInput } from 'azrmui/core/FormInputs';
import { createHandleUploadFunction } from 'azrmui/core/FormInputs/FormImagesInput';
import useSystemInfo from '../../hooks/useSystemInfo';
import CrudForm from './CrudForm';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const handleUpload = createHandleUploadFunction('/api/files');

export default (props) => {
  const {
    value,
    dialogProps: dp1,
    onChange = () => {},
  } = props;

  const classes = useStyles();
  const [imageInfos, setImageInfos] = useState([{
    id: 'd980f6ea-c597-45ad-846a-7c4451dba796',
    image: {
      hash: '4d26c5f329024c93d8a289cf38a169edf61a5e75b9e3caec95f5542c51e4779f',
      id: 'd980f6ea-c597-45ad-846a-7c4451dba796',
      imgUrl: 'https://picsum.photos/200/300',
      metadata: {},
      name: '隨機圖片.png',
    },
  }, {
    id: 'd980f6ea-c597-45ad-846a-7c4451dba7962',
    image: {
      hash: '4d26c5f329024c93d8a289cf38a169edf61a5e75b9e3caec95f5542c51e4779f2',
      id: 'd980f6ea-c597-45ad-846a-7c4451dba7962',
      imgUrl: 'https://picsum.photos/200/300',
      metadata: {},
      name: '隨機圖片.png',
    },
  }]);
  const [list, setList] = useState([
    { id: 1, text: 'Xxxx1' },
    { id: 2, text: 'Xxxx2' },
  ]);
  const [id, setId] = useState(2);
  const [searchText, setSearchText] = useState('');

  const onSubmit = (value, editingParams, index) => {
    if (index == null) {
      setId(id + 1);
      setList([...list, { ...value, id: id + 1 }]);
    } else {
      const newList = [...list];
      newList.splice(index, 1, value);
      setList(newList);
    }
  };

  const [{
    // open,
    exited,
    dialogProps: dp2,
  }, {
    handleOpen,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    open: () => {
    },
    close: (v) => {
      if (v !== undefined && v !== Cancel) {
        onChange(v);
      }
    },
  });

  const dialogProps = { ...dp1, ...dp2 };

  const renderAddItem = ({
    handleItemClick,
  }) => (
    <React.Fragment>
      <ListItem button onClick={() => handleItemClick({ defaultText: searchText })}>
        <ListItemAvatar>
          <Avatar alt="Logo" src="./mail-assets/logo.png" />
        </ListItemAvatar>
        <ListItemText primary={searchText ? `<Create '${searchText}...'>` : '<New Item>'} />
      </ListItem>
      <Divider />
    </React.Fragment>
  );

  const renderListItem = ({
    handleItemClick,
  }, value) => (
    <ListItem
      button
      key={value.id}
      onClick={handleItemClick}
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <Avatar alt="Logo" src="./mail-assets/logo.png" />
      </ListItemAvatar>
      <ListItemText
        primary={`ID: ${value.id}`}
        secondary={(
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              className={classes.inline}
              color="textPrimary"
            >
              Text
            </Typography>
            {` — ${value.text}`}
          </React.Fragment>
        )}
      />
    </ListItem>
  );

  const onSearchTextChange = t => setSearchText(t);
  const onStartSearch = () => setSearchText('');
  const onFinishSearch = () => setSearchText('');

  const systemInfo = useSystemInfo();

  if (!systemInfo || !systemInfo.features || !systemInfo.features.objectStorage) {
    return <div>This demo requires the object storage feature in server side</div>;
  }

  return (
    <React.Fragment>
      <FormImagesInput
        label="Images"
        value={imageInfos}
        onChange={setImageInfos}
        onAdd={(imageInfo, { context }) => {
          context.uploadImage(imageInfo);
          setImageInfos(imageInfos => imageInfos.concat([imageInfo]));
        }}
        fullWidth
        handleUpload={handleUpload}
      />
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        Crud Dialog
      </Button>
      {(!exited) && (
        <CrudDialogEx
          list={searchText ? list.filter(item => (item.text || '').includes(searchText)) : list}
          addItemPlacement="start"
          renderAddItem={renderAddItem}
          renderListItem={renderListItem}
          CrudForm={CrudForm}
          value={value}
          onSubmit={onSubmit}
          onSearchTextChange={onSearchTextChange}
          onStartSearch={onStartSearch}
          onFinishSearch={onFinishSearch}
          {...dialogProps}
        />
      )}
    </React.Fragment>
  );
};
