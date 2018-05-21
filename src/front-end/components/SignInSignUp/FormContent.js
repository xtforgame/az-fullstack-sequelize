import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

let styles = theme => ({
  content: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 12,
      marginRight: theme.spacing.unit * 12,
    },
  },
});

const FormContent = (props) => {
  return (<div className={props.classes.content} children={props.children} />);
}

export default compose(
  withStyles(styles),
)(FormContent);
