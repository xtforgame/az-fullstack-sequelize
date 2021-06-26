/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflowX: 'scroll',
    width: '100%',
  },
  imageItem: {
    flexShrink: 0,
    display: 'inline-block',
    cursor: 'pointer',
    margin: 12,
    // border: '1px black solid',
    backgroundPositionX: 'center',
    backgroundPositionY: 'center',
    backgroundRepeat: 'no-repeat',
  },
}));

export const getItemStyle = (image, {
  width = 300,
  height = 200,
  mode = 'contain',
} = {}) => ({
  width,
  height,
  backgroundImage: `url(${image && image.url})`,
  backgroundSize: mode,
});

export default ({
  value,
  onChange = () => null,
  images,
  itemOptions,
}) => {
  const classes = useStyles();
console.log('images :', images);
  return (
    <div className={classes.container}>
      {
        (images || []).map((image, i) => (
          <div
            key={image.id}
            className={classes.imageItem}
            style={getItemStyle(image, itemOptions)}
            onClick={e => onChange(image, i)}
          />
        ))
      }
    </div>
  );
};
