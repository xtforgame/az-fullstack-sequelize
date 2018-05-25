import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import createButtonStyles from '~/styles/Buttons';

const styles = theme => ({
  ...createButtonStyles(theme, 'success'),
});

const SuccessButton = ({classes, ...props}) => (
  <Button
    variant="raised"
    classes={{
      raisedPrimary: classes.raisedPrimary,
    }}
    {...props}
  />
);

export default compose(
  withStyles(styles),
)(SuccessButton);
