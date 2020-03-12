import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Drawer from '@material-ui/core/Drawer';

import Divider from '@material-ui/core/Divider';
import ProgressWithMask from '~/components/Progress/ProgressWithMask';
import {
  appTempStateSelector,
} from '~/containers/App/selectors';
import createCommonStyles from '~/styles/common';
import ProjectDropdown from '~/containers/ProjectDropdown';
import MainAppBar from './MainAppBar';
import ErrorContent from './ErrorContent';
import {
  getMailFolderList,
  getOtherMailFolderList,
} from './tileData';

import RouteList from './RouteList';
import NotificationPanel from './NotificationPanel';

const styles = theme => ({
  leftPanel: {
    width: 250,
  },
  rightPanel: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 360,
    },
  },
  container: {
    // margin: 5,
    width: '100%',
    height: '100%',
  },
  mainContent: {
    // margin: 5,
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      // margin: 40,
      // width: 1200,
    },
  },
  media: {
    position: 'relative',
    height: 150,
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class MainFrame extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mainMenuDrawerOpened: false,
      notificationPanelDrawerOpened: false,
    };
  }

  closeDrawer = () => {
    this.setState({
      mainMenuDrawerOpened: false,
      notificationPanelDrawerOpened: false,
    });
  };

  toggleMainMenuDrawer = open => () => {
    this.setState({
      mainMenuDrawerOpened: open,
    });
  };

  toggleNotificationPanelDrawer = open => () => {
    this.setState({
      notificationPanelDrawerOpened: open,
    });
  };

  renderMainContent() {
    const {
      routeView,
      push,
      classes,
    } = this.props;
    const {
      mainMenuDrawerOpened,
      notificationPanelDrawerOpened,
    } = this.state;

    const leftSideList = (
      <div className={classes.leftPanel}>
        <RouteList closeDrawer={this.closeDrawer} />
        {/* <Divider />
        {getMailFolderList(this.closeDrawer, () => push('/home'), () => push('/async-in-main'), () => push('/login'))}
        <Divider />
        {getOtherMailFolderList(this.closeDrawer)} */}
      </div>
    );

    const rightSidePanel = (
      <div className={classes.rightPanel}>
        <NotificationPanel closeDrawer={this.closeDrawer} />
      </div>
    );

    return (
      <React.Fragment>
        <MainAppBar
          onToggleMenu={this.toggleMainMenuDrawer(true)}
          onToggleNotificationPanel={this.toggleNotificationPanelDrawer(true)}
        />
        <div className={classes.appBarPlaceholder}>DDDD</div>
        {routeView}
        <Drawer
          open={mainMenuDrawerOpened}
          onClose={this.toggleMainMenuDrawer(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div
            tabIndex={0}
            role="button"
            // onClick={this.toggleMainMenuDrawer(false)}
            // onKeyDown={this.toggleMainMenuDrawer(false)}
          >
            <div
              style={{
                width: '100%',
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              <ProjectDropdown key="projectSelector" style={{ width: '100%' }} />
            </div>
            <Divider />
            {leftSideList}
          </div>
        </Drawer>
        <Drawer
          anchor="right"
          open={notificationPanelDrawerOpened}
          onClose={this.toggleNotificationPanelDrawer(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div
            tabIndex={0}
            role="button"
            // onClick={this.toggleMainMenuDrawer(false)}
            // onKeyDown={this.toggleMainMenuDrawer(false)}
          >
            {rightSidePanel}
          </div>
        </Drawer>
      </React.Fragment>
    );
  }

  render() {
    const {
      classes,
      appTempState: {
        userLoaded,
        loadUserError,
      } = {},
    } = this.props;

    return (
      <div className={classes.verticalFlexContainerFWFH}>
        {loadUserError && (<ErrorContent />)}
        {(userLoaded && !loadUserError) && this.renderMainContent()}
        <Fade
          in={!userLoaded && !loadUserError}
          timeout={{
            enter: 0,
            exit: 200,
          }}
          unmountOnExit
        >
          <ProgressWithMask
            backgroundColor="#FFFFFF"
            zIndex={1101}
            delay={0}
          />
        </Fade>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  appTempState: appTempStateSelector,
});

export default compose(
  connect(
    mapStateToProps,
    { push }
  ),
  withStyles(styles),
)(MainFrame);
