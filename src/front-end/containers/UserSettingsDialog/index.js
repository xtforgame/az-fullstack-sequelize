import React from 'react';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import SimpleFullScreenDialog from '~/components/Dialogs/SimpleFullScreenDialog';
import { messages } from '~/containers/App/translation';
import {
  changeTheme,
} from '~/containers/App/actions';
import {
  makeUiThemeSelector,
} from '~/containers/App/selectors';

const styles = {
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

  render() {
    const {
      open,
      onClose,
      uiTheme,
    } = this.props;
    return (
      <SimpleFullScreenDialog
        title={<FormattedMessage {...messages.settings} />}
        open={open}
        onClose={onClose}
      >
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
      </SimpleFullScreenDialog>
    );
  }
}

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
