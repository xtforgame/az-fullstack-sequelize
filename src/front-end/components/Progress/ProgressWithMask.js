import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import purple from 'material-ui/colors/purple';

const styles = theme => ({
  maskedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',

    //verticalFlexContainer
    flexDirection: 'column',
    display: 'flex',
    // height: '100%',
  },
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    //verticalFlexContainer
    flexDirection: 'column',
    display: 'flex',
    // height: '100%',
  },
  flexContainer: {
    display: 'flex',
  },
  spacing: {
    flex: 1,
  },
  progress: {
    // margin: `0 ${theme.spacing.unit * 2}px`,
  },
});

class ProgressWithMask extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  constructor(...args){
    super(...args);
    this.state = {
      delayTimeout: null,
      show: false,
    };
  }

  componentWillMount() {
    const { delay } = this.props;

    if(delay){
      let delayTimeout = setTimeout(() => {
        this.setState({
          delayTimeout: null,
          show: true,
        });
      }, delay);
      this.setState({
        delayTimeout,
        show: false,
      });
    }else{
      this.setState({
        delayTimeout: null,
        show: true,
      });
    }
  }

  componentWillUnmount() {
    if(this.state.delayTimeout){
      clearTimeout(this.state.delayTimeout);
    }
  }

  render(){
    const { classes } = this.props;
    const { show } = this.state;

    return (
      <div className={show ? classes.maskedContainer : classes.container}>
        <div className={classes.spacing} />
        <div className={classes.flexContainer}>
          <div className={classes.spacing} />
          {show && <CircularProgress className={classes.progress} size={50} color="primary" thickness={7} />}
          <div className={classes.spacing} />
        </div>
        <div className={classes.spacing} />
      </div>
    );
  }
}

export default withStyles(styles)(ProgressWithMask);
