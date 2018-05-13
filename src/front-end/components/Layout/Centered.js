/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

const styles = theme => ({
  aligner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  alignerItem: {
    flex: '1',
  },

  alignerItemTop: {
    alignSelf: 'flex-start',
  },

  alignerItemBottom: {
    alignSelf: 'flex-end',
  },

  alignerItemFixed: {
    flex: 'none',
  },
});

const Centered = (props) => (
  <div className={classNames(props.classes.aligner, props.className)}>
    <div className={classNames(props.classes.alignerItem, props.classes.alignerItemTop)}></div>
    <div className={classNames(props.classes.alignerItemFixed)}>
      {props.children}
    </div>
    <div className={classNames(props.classes.alignerItem, props.classes.alignerItemBottom)}></div>
  </div>
);

export default withStyles(styles)(Centered);
