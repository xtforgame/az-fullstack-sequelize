import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import { green, lightBlue, orange, red } from '@material-ui/core/colors';
import GaugeBar from './GaugeBar';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  card: {
    width: '100%',
    display: 'flex',
  },
  status: {
    margin: 8,
    width: 200,
    flex: 1,
  },
});

class Status extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    const { style, classes, theme } = this.props;
    const labelColor = fade(theme.palette.background.paper, 0.7);
    const textColor = theme.palette.text.primary;

    return (
      <Card className={classes.card} style={style}>
        <div className={classes.status}>
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 50, color: green[700] },
            { name: '2', percent: 50, color: green[400] },
          ]} />
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 50, color: lightBlue[700] },
            { name: '2', percent: 30, color: lightBlue[400] },
          ]} />
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 40, color: orange[700] },
            { name: '2', percent: 40, color: orange[400] },
          ]} />
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 30, color: red[700] },
            { name: '2', percent: 30, color: red[400] },
          ]} />
        </div>
        <div className={classes.status}>
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 50, color: green[700] },
            { name: '2', percent: 50, color: green[400] },
          ]} />
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 50, color: lightBlue[700] },
            { name: '2', percent: 30, color: lightBlue[400] },
          ]} />
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 40, color: orange[700] },
            { name: '2', percent: 40, color: orange[400] },
          ]} />
          <GaugeBar textColor={textColor} labelColor={labelColor} segments={[
            { name: '1', percent: 30, color: red[700] },
            { name: '2', percent: 30, color: red[400] },
          ]} />
        </div>
      </Card>
    );
  }
}


export default withStyles(styles, { withTheme: true })(Status);
