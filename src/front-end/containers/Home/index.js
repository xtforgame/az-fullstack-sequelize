import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import formatMessage from '~/utils/formatMessage';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { messages } from '../App/translation';
import SimpleMediaCard from './SimpleMediaCard';

const styles = theme => ({
  placeholder: {
    height: 40,
  },
  mainContainer: {
    margin: 8,
    [theme.breakpoints.up('sm')]: {
      margin: 40,
    },
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
});

class Home extends React.Component {
  render() {
    const {
      routeView, intl, greetName, classes,
    } = this.props;

    return (
      <div className={classes.mainContainer}>
        <Typography variant="display3">
          Home
        </Typography>
        <Divider />
        <div className={classes.placeholder} />
        { routeView }
        <Typography variant="title">
          {formatMessage(intl, messages.greetText, { user: greetName || 'user0001' })}
        </Typography>
        <Typography variant="title">
          <ruby>
            <rb>
圖
            </rb>
            <rt>
ㄊㄨˊ
            </rt>
            <rb>
書
            </rb>
            <rt>
ㄕㄨ
            </rt>
            <rb>
館
            </rb>
            <rt>
ㄍㄨㄢˇ
            </rt>
            <rb>
圖
            </rb>
            <rt>
ㄊㄨˊ
            </rt>
            <rb>
書
            </rb>
            <rt>
ㄕㄨ
            </rt>
            <rb>
館
            </rb>
            <rt>
ㄍㄨㄢˇ
            </rt>
            <rb>
圖
            </rb>
            <rt>
ㄊㄨˊ
            </rt>
            <rb>
書
            </rb>
            <rt>
ㄕㄨ
            </rt>
            <rb>
館
            </rb>
            <rt>
ㄍㄨㄢˇ
            </rt>
            <rb>
圖
            </rb>
            <rt />
            <rb>
書
            </rb>
            <rt />
            <rb>
館
            </rb>
            <rt />
            <rb>
圖
            </rb>
            <rt>
ㄊㄨˊ
            </rt>
            <rb>
書
            </rb>
            <rt>
ㄕㄨ
            </rt>
            <rb>
館
            </rb>
            <rt>
ㄍㄨㄢˇ
            </rt>
            ㄊㄨˊㄕㄨㄍㄨㄢˇ
          </ruby>
        </Typography>
        <Typography variant="title">
          <ruby>
            <rb>
図
            </rb>
            <rt>
と
            </rt>
            <rb>
書
            </rb>
            <rt>
しょ
            </rt>
            <rb>
館
            </rb>
            <rt>
かん
            </rt>
            <rb>
図
            </rb>
            <rt>
と
            </rt>
            <rb>
書
            </rb>
            <rt>
しょ
            </rt>
            <rb>
館
            </rb>
            <rt>
かん
            </rt>
            <rb>
図
            </rb>
            <rt>
と
            </rt>
            <rb>
書
            </rb>
            <rt>
しょ
            </rt>
            <rb>
館
            </rb>
            <rt>
かん
            </rt>
            <rb>
図
            </rb>
            <rt />
            <rb>
書
            </rb>
            <rt />
            <rb>
館
            </rb>
            <rt />
            <rb>
図
            </rb>
            <rt>
と
            </rt>
            <rb>
書
            </rb>
            <rt>
しょ
            </rt>
            <rb>
館
            </rb>
            <rt>
かん
            </rt>
            としょかん
          </ruby>
        </Typography>

        <Icon className="fa fa-calculator" />
        <Icon color="primary" className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true" />
        </Icon>
        <Icon className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true" />
        </Icon>
        <Icon className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true" />
        </Icon>
        <Icon color="action" className={classes.icon}>
          <i className="fa fa-calculator" aria-hidden="true" />
        </Icon>
        <div className={classes.cardContainer}>
          <div className={classes.cardWrapper}>
            <SimpleMediaCard />
          </div>
          <div className={classes.cardWrapper}>
            <SimpleMediaCard />
          </div>
          <div className={classes.cardWrapper}>
            <SimpleMediaCard />
          </div>
          <div className={classes.cardWrapper}>
            <SimpleMediaCard />
          </div>
          <div className={classes.cardWrapper}>
            <SimpleMediaCard />
          </div>
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
