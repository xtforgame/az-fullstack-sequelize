import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    // '& > *': {
    //   maxWidth: 1200,
    //   padding: theme.spacing(2),
    //   margin: theme.spacing(4),
    //   width: '100%',
    // },
  },
  withMaxWith: {
    maxWidth: 1200,
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(4),
    width: '100%',
  },
}));

export default ({ children, withMaxWith }) => {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <Paper className={clsx(classes.paper, { [classes.withMaxWith]: withMaxWith })} variant="outlined" elevation={0}>
        {children}
      </Paper>
    </section>
  );
};
