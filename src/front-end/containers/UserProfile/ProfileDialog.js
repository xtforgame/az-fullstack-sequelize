import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import SimpleFullScreenDialog from '~/components/Dialogs/SimpleFullScreenDialog';
import { messages } from '~/containers/App/translation';
import Profile from './Profile';

const styles = theme => ({
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflowX: 'hidden',
    flex: 1,
  },
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    background: theme.palette.background.default,
    padding: 8,
    [theme.breakpoints.up('sm')]: {
      padding: 48,
    },
  },
});

class UserProfile extends React.Component {
  render() {
    const {
      classes,
      open,
      onClose,
    } = this.props;
    return (
      <SimpleFullScreenDialog
        title={<FormattedMessage {...messages.profile} />}
        open={open}
        onClose={onClose}
      >
        <div className={classes.root}>
          <div className={classes.paperRoot}>
            <Profile />
          </div>
        </div>
      </SimpleFullScreenDialog>
    );
  }
}

export default compose(
  injectIntl,
  withStyles(styles),
)(UserProfile);
