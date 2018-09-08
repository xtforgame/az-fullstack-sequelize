/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SimpleExpansionCard from '~/components/Cards/SimpleExpansionCard';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

moment.locale('zh-TW');

const styles = theme => ({
  avatar: {
    backgroundColor: blue[500],
  },
});

class ScheduleCard extends React.Component {
  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, memo: { data: memo } = {} } = this.props;

    return (
      <SimpleExpansionCard
        avatar={(
          <Avatar aria-label="Avatar" className={classes.avatar}>
            S
          </Avatar>
        )}
        title={(
          <Typography
            variant="body1"
            component="pre"
            color="textSecondary"
          >
            {memo.title}
          </Typography>
        )}
      >
        Detail
      </SimpleExpansionCard>
    );
  }
}

export default withStyles(styles)(ScheduleCard);
