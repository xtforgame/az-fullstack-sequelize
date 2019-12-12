import React, { useState, useEffect, useRef } from 'react';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
// import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useConnect } from '~/hooks/redux-react-hook-ex';
import MoreActionMenuButton from '~/components/Buttons/MoreActionMenuButton';
import modelMapEx from '~/containers/App/modelMapEx';
import {
  makeSelectedProjectSelector,
} from '~/containers/App/selectors';

const {
  user,
  // userSetting,
  // organization,
  // project,
} = modelMapEx.querchy.promiseActionCreatorSets;

const mapStateToProps = createStructuredSelector({
  userQueryMap: modelMapEx.cacher.selectorCreatorSet.user.selectQueryMap(),
  selectedProject: makeSelectedProjectSelector(),
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
  const classes = useStyles();
  const {
    userQueryMap: {
      metadata,
      values,
    },
    selectedProject,
  } = useConnect(mapStateToProps, mapDispatchToProps);

  const projectMemberQueryName = selectedProject && `./api/projects/${selectedProject.organization_id}/members`;
  const orgMemberQueryName = selectedProject && `./api/organizations/${selectedProject.id}/members`;

  const projectMemberMetadata = metadata[projectMemberQueryName] || {};
  const projectMembers = values[projectMemberQueryName] || [];

  const orgMemberMetadata = metadata[orgMemberQueryName] || {};
  const orgMembers = values[orgMemberQueryName] || [];

  const [updatedBaseTime, setUpdatedBaseTime] = useState(new Date().getTime());
  const [reqTime, setReqTime] = useState(0);
  const [, forceUpdate] = useState({});
  const loaded = useRef(0);
  const autocompleteOptions = useRef(null);
  const [selectValue, setSelectValue] = useState([]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }
    loaded.current = 0;
    setReqTime(new Date().getTime());
    user.getCollection({ queryId: projectMemberQueryName, actionProps: { url: projectMemberQueryName } })
    .then(() => {
      loaded.current++;
      forceUpdate({});
    });
    user.getCollection({ queryId: orgMemberQueryName, actionProps: { url: orgMemberQueryName } })
    .then(() => {
      loaded.current++;
      forceUpdate({});
    });
  }, [selectedProject, updatedBaseTime]);

  const isReady = selectedProject
    && reqTime
    && projectMemberMetadata && projectMemberMetadata.requestTimestamp >= reqTime
    && orgMemberMetadata && orgMemberMetadata.requestTimestamp >= reqTime
    && loaded.current === 2;

  if (isReady && !autocompleteOptions.current) {
    const projMemberSet = new Set(projectMembers.map(m => m.id));
    autocompleteOptions.current = orgMembers.filter(m => !projMemberSet.has(m.id));
    const unselectedMemberMap = new Map(
      autocompleteOptions.current.map(m => [m.id, m]),
    );
    setSelectValue(
      selectValue
      .filter(m => !projMemberSet.has(m.id))
      .map(m => unselectedMemberMap.get(m.id))
    );
  }

  const reload = () => {
    loaded.current = 0;
    autocompleteOptions.current = null;
    setUpdatedBaseTime(new Date().getTime());
  };

  const getActionMenuItems = memberId => closeMenu => ([
    // <MenuItem
    //   key="edit"
    //   onClick={() => {
    //     // console.log('Edit');
    //     closeMenu();
    //   }}
    // >
    //   Edit
    // </MenuItem>,
    <MenuItem
      key="delete"
      onClick={() => {
        // console.log('Delete');
        user.delete(Symbol('FakeId'), { queryId: projectMemberQueryName, actionProps: { url: `${projectMemberQueryName}/${memberId}` } })
        .then(() => {
          reload();
        });
        closeMenu();
      }}
    >
      移出專案
    </MenuItem>,
  ]);

  const getIdentifier = option => option.userOrganization.labels.identifier || '';
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Autocomplete
          style={{ flex: 1 }}
          key={updatedBaseTime}
          disablePortal
          multiple
          noOptionsText="找不到成員"
          id="tags-outlined"
          options={autocompleteOptions.current || []}
          getOptionLabel={option => `${option.name}(ID:${option.id})(${getIdentifier(option) || '<無識別名稱>'})`}
          renderTags={
            (value, getTagProps) => value.map((option, index) => (
              <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
            ))
          }
          value={selectValue}
          onChange={(event, newValue) => {
            setSelectValue(newValue);
          }}
          filterOptions={(options, state) => {
            let { inputValue } = state;
            inputValue = (inputValue || '').toLowerCase();
            return options.filter((option) => {
              if (option.name && option.name.toLowerCase().includes(inputValue)) {
                return true;
              }
              if (getIdentifier(option).toLowerCase().includes(inputValue)) {
                return true;
              }
              return false;
            });
          }}
          filterSelectedOptions
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="新增成員"
              placeholder="名稱/信箱"
              fullWidth
            />
          )}
        />
        {/* <div style={{ width: 10, height: 1 }} /> */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <IconButton
            aria-label="Add"
            aria-haspopup="true"
            color="primary"
            disabled={!selectValue || selectValue.length === 0}
            onClick={() => {
              Promise.all(selectValue.map(
                m => user.create({ memberId: m.id }, { queryId: projectMemberQueryName, actionProps: { url: projectMemberQueryName } })
              ))
              .then(reload)
              .catch(reload);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </div>
      <List>
        {projectMembers.map(projectMember => (
          <ListItem
            button
            key={projectMember.id}
            onClick={() => {}}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Avatar alt="Logo" src={projectMember.picture || './mail-assets/logo.png'} />
            </ListItemAvatar>
            <ListItemText
              primary={`${projectMember.name}(ID: ${projectMember.id})`}
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
                  {` — ${projectMember.userProject.labels.identifier || '<無>'}`}
                </React.Fragment>
              )}
            />
            <ListItemSecondaryAction>
              <MoreActionMenuButton
                getActionMenuItems={getActionMenuItems(projectMember.id)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
