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
import createCommonStyles from '~/styles/common';
import { push } from 'react-router-redux';
import {
  withRouter,
} from 'react-router-dom';

const styles = theme => ({
  nav: {
    width: '100%',
  },
  spacing: {
    height: 8,
  },
  ...createCommonStyles(theme, ['flex', 'mobile']),
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
      <div className={classes.mobielContainer}>
        <div className={classes.mobileContentPlaceholder} />
        <div className={classes.mobileContent}>
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
