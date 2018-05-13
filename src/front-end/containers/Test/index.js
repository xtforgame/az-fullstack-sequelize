import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import formatMessage from '~/utils/formatMessage';
import { messages } from '../App/translation';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

const styles = {
  placeholder: {
    height: 40,
  },
  mainContainer: {
    margin: 40,
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
};

class Test extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let { routeView, intl, greetName, classes } = this.props;

    return (
      <div className={classes.mainContainer}>
        <Typography variant="display3">
          Test
        </Typography>
        <Divider />
        <div className={classes.placeholder} />
        { routeView }
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      greetName: state.get('global').greetName,
    }),
    {}
  ),
  injectIntl,
  withStyles(styles),
)(Test);
