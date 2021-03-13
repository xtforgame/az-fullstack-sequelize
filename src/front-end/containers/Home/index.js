import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SimpleMediaCard from './SimpleMediaCard';
import SimpleMediaCard2 from './SimpleMediaCard2';

const styles = theme => ({
  placeholder: {
    height: 40,
  },
  mainContainer: {
    // margin: 8,
    // [theme.breakpoints.up('sm')]: {
    //   margin: 40,
    // },
    height: '100%',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  cardWrapper: {
    margin: 8,
  },
  icon: {
    fontSize: 24,
  },
  listFull: {
    width: 'auto',
  },
});

class Home extends React.PureComponent {
  render() {
    const {
      routeView, t, greetName, classes,
    } = this.props;

    return (
      <div className={classes.mainContainer}>
        { routeView }
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      greetName: state.global.greetName,
    }),
  ),
  withTranslation(['app-common']),
  withStyles(styles),
)(Home);
