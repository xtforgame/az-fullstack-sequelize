import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import formatMessage from '~/utils/formatMessage';
import { messages } from '../App/translation';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import SimpleMediaCard from './SimpleMediaCard';

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

class Home extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let { routeView, intl, greetName, classes } = this.props;

    return (
      <div>
        <Typography variant="display3">
          Home
        </Typography>
        <Divider />
        <div className={classes.placeholder} />
        { routeView }
        <Typography variant="title">
          {formatMessage(intl, messages.greetText, {user: greetName || 'user0001'})}
        </Typography>
        <Typography variant="title">
          <ruby>
            <rb>圖</rb><rt>ㄊㄨˊ</rt>
            <rb>書</rb><rt>ㄕㄨ</rt>
            <rb>館</rb><rt>ㄍㄨㄢˇ</rt>
            <rb>圖</rb><rt>ㄊㄨˊ</rt>
            <rb>書</rb><rt>ㄕㄨ</rt>
            <rb>館</rb><rt>ㄍㄨㄢˇ</rt>
            <rb>圖</rb><rt>ㄊㄨˊ</rt>
            <rb>書</rb><rt>ㄕㄨ</rt>
            <rb>館</rb><rt>ㄍㄨㄢˇ</rt>
            <rb>圖</rb><rt></rt>
            <rb>書</rb><rt></rt>
            <rb>館</rb><rt></rt>
            <rb>圖</rb><rt>ㄊㄨˊ</rt>
            <rb>書</rb><rt>ㄕㄨ</rt>
            <rb>館</rb><rt>ㄍㄨㄢˇ</rt>
            ㄊㄨˊㄕㄨㄍㄨㄢˇ
          </ruby>
        </Typography>
        <Typography variant="title">
          <ruby>
            <rb>図</rb><rt>と</rt>
            <rb>書</rb><rt>しょ</rt>
            <rb>館</rb><rt>かん</rt>
            <rb>図</rb><rt>と</rt>
            <rb>書</rb><rt>しょ</rt>
            <rb>館</rb><rt>かん</rt>
            <rb>図</rb><rt>と</rt>
            <rb>書</rb><rt>しょ</rt>
            <rb>館</rb><rt>かん</rt>
            <rb>図</rb><rt></rt>
            <rb>書</rb><rt></rt>
            <rb>館</rb><rt></rt>
            <rb>図</rb><rt>と</rt>
            <rb>書</rb><rt>しょ</rt>
            <rb>館</rb><rt>かん</rt>
            としょかん
          </ruby>
        </Typography>
        
        <Icon className="fa fa-calculator" />
        <Icon color="primary" className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true"></i>
        </Icon>
        <Icon className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true"></i>
        </Icon>
        <Icon className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true"></i>
        </Icon>
        <Icon color="action" className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true"></i>
        </Icon>
        <div className={classes.cardContainer}>
          <div className={classes.cardWrapper}><SimpleMediaCard /></div>
          <div className={classes.cardWrapper}><SimpleMediaCard /></div>
          <div className={classes.cardWrapper}><SimpleMediaCard /></div>
          <div className={classes.cardWrapper}><SimpleMediaCard /></div>
          <div className={classes.cardWrapper}><SimpleMediaCard /></div>
        </div>
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
  injectIntl,
  withStyles(styles),
)(Home);
