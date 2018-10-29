import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Zoom from '@material-ui/core/Zoom';
import createCommonStyles from '~/styles/common';
import { push } from 'react-router-redux';
// import NewProjectDialog from './tabs/Projects/NewProjectDialog';

const styles = theme => ({
  nav: {
    width: '100%',
  },
  spacing: {
    width: 1,
    height: 8,
  },
  spaceForFab: {
    width: 1,
    height: theme.spacing.unit * 2 * 2 + 56,
  },
  fabContainer: {
    position: 'relative',
  },
  ...createCommonStyles(theme, ['flex', 'mobile']),
});

class MobileTabsFrame extends React.Component {
  changeTab = tabName => this.props.handleTabChange(undefined, `${this.props.parentUrl}/${tabName}`);

  render() {
    const {
      beforeRouteView,
      routeView,
      afterRouteView,
      classes,
      theme,
      parentUrl,
      pathname,
      handleTabChange,
      tabs = [],
      children,
    } = this.props;

    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    let newRouteView = routeView;
    if (routeView) {
      // Append props to children
      newRouteView = newRouteView.map(v => React.cloneElement(v, {
        componentProps: {
          changeTab: this.changeTab,
        },
      }));
    }
    return (
      <div className={classes.mobielContainer}>
        <div className={classes.mobileContentPlaceholder} />
        { beforeRouteView }
        <div className={classes.mobileContent}>
          { newRouteView }
          <div className={classes.spaceForFab} />
        </div>
        { afterRouteView }
        <div className={classes.spacing} />
        <div className={classes.fabContainer}>
          {
            tabs.filter(tab => tab.fab).map(({ name, fab }) => (
              <Zoom
                key={name}
                in={pathname === `${parentUrl}/${name}`}
                timeout={transitionDuration}
                style={{
                  transitionDelay: `${pathname === `${parentUrl}/${name}` ? transitionDuration.exit : 0}ms`,
                }}
                unmountOnExit
              >
                {fab}
              </Zoom>
            ))
          }
        </div>
        <BottomNavigation value={pathname} onChange={handleTabChange} className={classes.nav}>
          {tabs.map(({ name, nav }) => {
            if (React.isValidElement(nav)) {
              return nav;
            }
            const {
              label,
              path,
              icon,
            } = nav;
            return (
              <BottomNavigationAction key={name} label={label || name} value={path || `${parentUrl}/${name}`} icon={icon} />
            );
          })}
        </BottomNavigation>
        {children}
      </div>
    );
  }
}

export default compose(
  connect(null, { push }),
  injectIntl,
  withStyles(styles, { withTheme: true }),
)(MobileTabsFrame);