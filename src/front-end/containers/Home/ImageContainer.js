import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
}));

export default (props) => {
  const {
    className,
    ...restProps
  } = props;

  const classes = useStyles();

  return (
    <CardMedia
      {...restProps}
      className={clsx(className, classes.root)}
    />
  );
};
