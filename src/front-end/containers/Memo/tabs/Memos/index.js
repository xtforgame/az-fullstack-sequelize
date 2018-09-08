/* eslint-disable no-console */
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import FlipMove from 'react-flip-move';
import MemoCard from './MemoCard';

import modelMap from '~/containers/App/modelMap';


const {
  makeDefaultMemoCollectionSelector,
} = modelMap.selectors;

const styles = theme => ({
  spaceForFab: {
    width: 1,
    height: theme.spacing.unit * 2 * 2 + 56,
  },
});

class Memos extends React.Component {
  render() {
    const { classes, memos } = this.props;

    return (
      <div>
        <FlipMove>
          {(memos || []).map(memo => (
            <MemoCard
              key={memo.id}
              memo={memo}
            />
          ))}
        </FlipMove>
        <div className={classes.spaceForFab} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  memos: makeDefaultMemoCollectionSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {},
  ),
  withStyles(styles),
)(Memos);
