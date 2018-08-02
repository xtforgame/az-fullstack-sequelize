import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Bot from './Bot';

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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'stats',
    };
  }

  handleTabChange = (_, value) => {
    // console.log('value :', value);
    this.setState({
      tab: value,
    });
  };

  changeTab = tabName => this.handleTabChange(undefined, `/home/${tabName}`);

  render() {
    const { routeView, classes } = this.props;

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
          <Bot />
          { newRouteView }
        </div>
        <div className={classes.spacing} />
        <BottomNavigation value={this.state.tab} onChange={this.handleTabChange} className={classes.nav}>
          <BottomNavigationAction label="Stats" value="stats" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Bot" value="bot" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Notifictions" value="notifictions" icon={<NotificationsIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      greetName: state.get('global').greetName,
    }), {
    }
  ),
  injectIntl,
  withStyles(styles),
)(Home);
