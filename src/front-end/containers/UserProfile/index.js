import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles'
import { compose } from 'recompose';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Profile from './Profile';

const styles = {
  placeholder: {
    height: 40,
  },
};

class UserProfile extends React.Component {  
  render(){
    const {
      classes,
    } = this.props;
    return (
      <Profile />
    );
  }
}

export default compose(
  withStyles(styles),
)(UserProfile);
