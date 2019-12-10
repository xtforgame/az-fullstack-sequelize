import React, { useState, useEffect, useRef } from 'react';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useConnect } from '~/hooks/redux-react-hook-ex';
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

  const [reqTime, setReqTime] = useState(0);
  const [, forceUpdate] = useState({});
  const loaded = useRef(0);
  const [selectValue, setSelectValue] = useState([]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }
    loaded.current = 0;
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
  }, [selectedProject]);

  const isReady = selectedProject
    && reqTime
    && projectMemberMetadata && projectMemberMetadata.requestTimestamp >= reqTime
    && orgMemberMetadata && orgMemberMetadata.requestTimestamp >= reqTime
    && loaded.current === 2;

  const getIdentifier = option => option.userOrganization.labels.identifier || '';
  return (
    <div>
      <Autocomplete
        disablePortal
        multiple
        noOptionsText="找不到成員"
        id="tags-outlined"
        options={orgMembers}
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
          </ListItem>
        ))}
      </List>
    </div>
  );
};
