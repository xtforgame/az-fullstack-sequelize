import React, { useState, useEffect, useRef } from 'react';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FormDialogInput from '~/components/FormInputs/FormDialogInput';
import { useConnect } from '~/hooks/redux-react-hook-ex';
import CrudDialogEx from '~/components/Dialogs/CrudDialogEx';
import modelMapEx from '~/containers/App/modelMapEx';
import CrudForm from './CrudForm';

const {
  user,
  userSetting,
  organization,
  project,
} = modelMapEx.querchy.promiseActionCreatorSets;

const mapStateToProps = createStructuredSelector({
  userQueryMap: modelMapEx.cacher.selectorCreatorSet.user.selectQueryMap(),
});

const mapDispatchToProps = {};

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

export default (props) => {
  const {
    dialogProps,
  } = props;

  const projectMemberQueryName = './api/projects/1/members';
  const orgMemberQueryName = './api/organizations/1/members';

  const classes = useStyles();
  const {
    userQueryMap: {
      metadata,
      values,
    },
  } = useConnect(mapStateToProps, mapDispatchToProps);

  const projectMemberMetadata = metadata[projectMemberQueryName];
  const projectMembers = values[projectMemberQueryName] || [];

  const orgMemberMetadata = metadata[orgMemberQueryName];
  const orgMembers = values[orgMemberQueryName] || [];

  const [id, setId] = useState(2);
  const [searchText, setSearchText] = useState('');

  const [reqTime, setReqTime] = useState(0);
  const [, forceUpdate] = useState({});
  const loaded = useRef(0);
  const [value, setValue] = useState(null);

  const [list, setList] = useState([
    { id: 1, name: 'Xxxx1' },
    { id: 2, name: 'Xxxx2' },
  ]);

  useEffect(() => {
    setReqTime(new Date().getTime());
    user.getCollection({ queryId: projectMemberQueryName, actionProps: { url: projectMemberQueryName } })
    .then((x) => {
      loaded.current++;
      forceUpdate({});
    });
    user.getCollection({ queryId: orgMemberQueryName, actionProps: { url: orgMemberQueryName } })
    .then((x) => {
      loaded.current++;
      forceUpdate({});
    });
  }, []);

  const isReady = reqTime
    && projectMemberMetadata && projectMemberMetadata.requestTimestamp >= reqTime
    && orgMemberMetadata && orgMemberMetadata.requestTimestamp >= reqTime
    && loaded.current === 2;

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

  const renderAddItem = ({
    handleItemClick,
  }) => (
    <React.Fragment>
      <ListItem button onClick={() => handleItemClick({ defaultText: searchText })}>
        <ListItemAvatar>
          <Avatar alt="Logo" src="./mail-assets/logo.png" />
        </ListItemAvatar>
        <ListItemText primary={searchText ? `<新增 '${searchText}...'>` : '<新增成員>'} />
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
        <Avatar alt="Logo" src={value.picture || './mail-assets/logo.png'} />
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
              識別名稱
            </Typography>
            {` — ${value.labels.identifier || '<無>'}`}
          </React.Fragment>
        )}
      />
    </ListItem>
  );

  const onSearchTextChange = t => setSearchText(t);
  const onStartSearch = () => setSearchText('');
  const onFinishSearch = () => setSearchText('');

  return (
    <FormDialogInput
      label="DateRange"
      value={value}
      displayValue={() => 'XX'}
      renderButton={({ buttonProps }) => (
        <Button
          variant="contained"
          color="primary"
          disabled={!isReady}
          {...buttonProps}
        >
          編輯組織
        </Button>
      )}
      onChange={setValue}
      // buttonProps={{
      //   fullWidth: true,
      // }}
      dialogProps={dialogProps}
      renderDialog={({
        label,
        title,
        open,
        handleClose,
        value,
        dialogProps,
      }) => (
        <CrudDialogEx
          list={searchText ? orgMembers.filter(item => (item.name || '').includes(searchText)) : orgMembers}
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
    />
  );
};
