import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

let styles = theme => ({
  content1: {
    height: theme.spacing.unit,
  },
  content2: {
    height: theme.spacing.unit * 2,
  },
  top: {
    height: theme.spacing.unit * 8,
  },
});

const FormSpace = (props) => {
  const {
    variant = 'content1',
  } = props;
  return (<div className={props.classes[variant]} />);
}

FormSpace.propTypes = {
  variant: PropTypes.oneOf(['top', 'content1', 'content2']),
};

export default compose(
  withStyles(styles),
)(FormSpace);