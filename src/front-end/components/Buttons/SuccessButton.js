import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  raisedPrimary: {
    contrastText: theme.palette.getContrastText(theme.palette.primary.main),
    color: theme.status.success.contrastText,
    backgroundColor: theme.status.success.main,
    '&:hover': {
      backgroundColor: theme.status.success.dark,
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: theme.status.success.main,
      },
    },
  },
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
