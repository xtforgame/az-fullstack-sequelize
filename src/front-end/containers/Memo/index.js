import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';
import ScheduleIcon from '@material-ui/icons/Schedule';
import AddIcon from '@material-ui/icons/Add';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import green from '@material-ui/core/colors/green';
import createCommonStyles from '~/styles/common';
import { push } from 'react-router-redux';
import {
  withRouter,
} from 'react-router-dom';

import modelMap from '~/containers/App/modelMap';
import NewMemoDialog from './tabs/Memos/NewMemoDialog';

const {
  getMemos,
} = modelMap.waitableActions;

const styles = theme => ({
  nav: {
    width: '100%',
  },
  spacing: {
    width: 1,
    height: 8,
  },
  fabContainer: {
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: green[500],
      },
    },
  },
  ...createCommonStyles(theme, ['flex', 'mobile']),
});

class Idle extends React.Component {
  state = {
    dialogOpen: false,
  };

  componentDidMount() {
    this.props.getMemos();
  }

  changeTab = tabName => this.handleTabChange(undefined, `/idle/${tabName}`);

  handleTabChange = (_, value) => {
    // console.log('value :', value);
    this.props.push(value);
  };

  closeDialog = () => {
    this.setState({
      dialogOpen: false,
    });
  }

  render() {
    const {
      routeView,
      classes,
      theme,
      location,
      match,
    } = this.props;

    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    const fabs = [
      {
        name: 'memos',
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
      },
      {
        name: 'schedules',
        color: 'inherit',
        className: classNames(classes.fab, classes.fabGreen),
        icon: <UpIcon />,
      },
    ];

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
        <div className={classes.mobileContent}>
          { newRouteView }
        </div>
        <div className={classes.spacing} />
        <div className={classes.fabContainer}>
          {fabs.map(fab => (
            <Zoom
              key={fab.color}
              in={location.pathname === `${match.url}/${fab.name}`}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${location.pathname === `${match.url}/${fab.name}` ? transitionDuration.exit : 0}ms`,
              }}
              unmountOnExit
            >
              <Button
                variant="fab"
                className={fab.className}
                color={fab.color}
                onClick={() => {
                  this.setState({
                    dialogOpen: true,
                  });
                }}
              >
                {fab.icon}
              </Button>
            </Zoom>
          ))}
        </div>
        <BottomNavigation value={location.pathname} onChange={this.handleTabChange} className={classes.nav}>
          <BottomNavigationAction label="Memos" value={`${match.url}/memos`} icon={<RestoreIcon />} />
          <BottomNavigationAction label="Schedules" value={`${match.url}/schedules`} icon={<ScheduleIcon />} />
        </BottomNavigation>
        {this.state.dialogOpen && (
          <NewMemoDialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
          />
        )}
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    {
      getMemos,
      push,
    },
  ),
  injectIntl,
  withRouter,
  withStyles(styles, { withTheme: true }),
)(Idle);
