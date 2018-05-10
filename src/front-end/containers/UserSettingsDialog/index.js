import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from 'material-ui/transitions/Slide';
import Switch from 'material-ui/Switch';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { messages } from '~/containers/App/translation';
import {
  changeTheme,
} from '~/containers/App/actions';
import {
  makeUiThemeSelector,
} from '~/containers/App/selectors';

const styles = {
  appBar: {
    position: 'relative',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  flex: {
    flex: 1,
  },
};

class UserSettingsDialog extends React.Component {
  handleToggle = () => {
    const {
      uiTheme,
      changeTheme,
    } = this.props;
    changeTheme({
      ...uiTheme,
      paletteType: uiTheme.paletteType === 'dark' ? 'light' : 'dark',
    });
  };
  
  render(){
    const {
      classes,
      open,
      onClose,
      uiTheme,
    } = this.props;
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" className={classes.menuButton} onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <FormattedMessage {...messages.settings} />
            </Typography>
            {/* <Button color="inherit" onClick={onClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <List>
          <ListItem
            button
            onClick={this.handleToggle}
          >
            {/* <ListItemIcon>
              <CloseIcon />
            </ListItemIcon> */}
            <ListItemText primary="Dark mode" secondary={uiTheme.paletteType === 'dark' ? 'on' : 'off'} />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle}
                checked={uiTheme.paletteType === 'dark'}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Dialog>
    );
  }
}

UserSettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {
      changeTheme,
    },
  ),
  injectIntl,
  withStyles(styles),
)(UserSettingsDialog);
