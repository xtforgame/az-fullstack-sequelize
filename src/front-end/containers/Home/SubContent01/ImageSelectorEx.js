import React, { useState } from 'react';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ImageSelector, { getItemStyle } from './ImageSelector';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  outerContainer: {
    width: '100%',
  },
  imageItem: {
    margin: 12,
    // border: '1px black solid',
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
  },
}));

export default ({ value, displayerOptions, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={classes.outerContainer}>
      <div className={classes.flexContainer} style={{ width: '100%' }}>
        <div
          className={classes.imageItem}
          style={getItemStyle(value, displayerOptions)}
        />
      </div>
      <ImageSelector
        {...{
          value, ...rest,
        }}
      />
    </div>
  );
};
