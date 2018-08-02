import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = {
  placeholder: {
    height: 40,
  },
  mainContainer: {
    margin: 40,
  },
};

class Test extends React.Component {
  render() {
    const {
      routeView, classes,
    } = this.props;

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
