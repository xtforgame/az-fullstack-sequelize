import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { push } from 'react-router-redux';
import {
  withRouter,
} from 'react-router-dom';

const styles = theme => ({
  nav: {
    width: '100%',
  },
  placeholder: {
    height: 0, // 40,
  },
  mainContainer: {
    margin: 8,
    [theme.breakpoints.up('sm')]: {
      margin: 40,
    },
  },
  verticalFlexContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  content: {
    marginRight: 8,
    marginLeft: 8,
    flex: 1,
    height: 1,
    overflowY: 'scroll',
  },
  spacing: {
    height: 8,
  },
});

class Idle extends React.Component {
  handleTabChange = (_, value) => {
    // console.log('value :', value);
    this.props.push(value);
  };

  changeTab = tabName => this.handleTabChange(undefined, `/idle/${tabName}`);

  render() {
    const { routeView, classes, location } = this.props;

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
      <div className={classes.verticalFlexContainer}>
        <div className={classes.placeholder} />
        <div className={classes.content}>
          { newRouteView }
        </div>
        <div className={classes.spacing} />
        <BottomNavigation value={location.pathname} onChange={this.handleTabChange} className={classes.nav}>
          <BottomNavigationAction label="Stats" value="/idle/stats" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Bot" value="/idle/bots" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Schedules" value="/idle/schedules" icon={<ScheduleIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    {
      push,
    },
  ),
  injectIntl,
  withRouter,
  withStyles(styles),
)(Idle);
