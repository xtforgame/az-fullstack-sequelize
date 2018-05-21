import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { push } from 'react-router-redux';
import { messages } from '../App/translation';
import MainAppBar from './MainAppBar';
import {
  getMailFolderList,
  getOtherMailFolderList,
} from './tileData';

import RouteList from './RouteList';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  list: {
    width: 250,
  },
  listFull: {
    width: 'auto',
  },
  container: {
    // margin: 5,
    width: '100%',
    height: '100%',
  },
  mainContent: {
    // margin: 5,
    width: '100%',
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      // margin: 40,
      // width: 1200,
    },
  },
  appBarPlaceholder: {
    height: 56,
    [theme.breakpoints.up('sm')]: {
      height: 64,
    },
  },
  verticalFlexContainer: {
    flexDirection: 'column',
    display: 'flex',
    height: '100%',
  },
  flexContainer: {
    flex: 1,
    display: 'flex',
  },
  spacing: {
    flex: 1,
  },
});

class MainFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      drawerOpened: false,
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpened: open,
    });
  };

  closeDrawer = () => {
    this.setState({
      drawerOpened: false,
    });
  };

  componentWillMount(){
    console.log('MainFrame componentWillMount');
  }

  render(){
    let { routeView, push, classes } = this.props;
    const sideList = (
      <div className={classes.list}>
        <RouteList closeDrawer={this.closeDrawer} />
        <Divider />
        {getMailFolderList(this.closeDrawer, () => push('/home'), () => push('/async-in-main'), () => push('/login'))}
        <Divider />
        {getOtherMailFolderList(this.closeDrawer)}
      </div>
    );

    return (
      <div className={classes.container}>
        <MainAppBar
          onToggleMenu={this.toggleDrawer(true)}
        />
        <div className={classes.appBarPlaceholder} />
        <div className={classes.verticalFlexContainer}>
          <div className={classes.mainContent}>
            {routeView}
          </div>
        </div>
        <Drawer
          open={this.state.drawerOpened}
          onClose={this.toggleDrawer(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div
            tabIndex={0}
            role="button"
            // onClick={this.toggleDrawer(false)}
            // onKeyDown={this.toggleDrawer(false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({}),
    { push }
  ),
  injectIntl,
  withStyles(styles),
)(MainFrame);
