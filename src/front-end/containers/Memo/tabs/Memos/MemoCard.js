/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ClickableCard from '~/components/Cards/ClickableCard';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  cardButton: {
    display: 'block',
    marginTop: 8,
    marginBottom: 8,
    maxWidth: 400,

    width: '100%',
  },
  headerContent: {
    overflowX: 'hidden',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'unset',
    },
  },
  contentRoot: {
    padding: 8,
    '&:last-child': {
      paddingBottom: 8,
    },
    [theme.breakpoints.up('sm')]: {
      padding: 24,
      '&:last-child': {
        paddingBottom: 24,
      },
    },
  },
  avatar: {
    backgroundColor: blue[500],
  },
});

class MemoCard extends React.Component {
  render() {
    const {
      classes,
      memo: { data: memo } = {},
    } = this.props;

    return (
      <ClickableCard
        buttonProps={{
          className: classes.cardButton,
        }}
      >
        <CardHeader
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
          classes={{
            root: classes.headerRoot,
            content: classes.headerContent,
          }}
        />
      </ClickableCard>
    );
  }
}

export default withStyles(styles)(MemoCard);
