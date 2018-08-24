import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { StickyContainer, Sticky } from 'react-sticky';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Status from './Status';
import CharCard from './CharCard';

const styles = {
  placeholder: {
    height: 40,
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  cardWrapper: {
    margin: 8,
  },
  icon: {
    fontSize: 24,
  },
  listFull: {
    width: 'auto',
  },
};

class Bot extends React.Component {
  render() {
    const { theme, width } = this.props;
    let topOffset = 56;
    if (isWidthUp('sm', width)) {
      topOffset = 64;
    }
    return (
      <div>
        <StickyContainer>
          <Sticky topOffset={-topOffset}>
            { ({ style }) => (
              <div style={{ ...style, top: topOffset, zIndex: 1101 }}>
                <div style={{ zIndex: 1102, position: 'relative' }}>
                  <Status />
                </div>
                <div style={{ width: '100%', height: 30, background: `linear-gradient(${fade(theme.palette.background.default, 1.0)}, ${fade(theme.palette.background.default, 0.0)})` }} />
              </div>
            ) }
          </Sticky>
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
          <CharCard />
          <br />
          <br />
        </StickyContainer>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      greetName: state.get('global').greetName,
    }),
  ),
  withWidth(),
  withStyles(styles, { withTheme: true }),
)(Bot);
