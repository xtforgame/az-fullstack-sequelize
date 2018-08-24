/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import {
  InternalLink as Link,
} from '~/components/SignInSignUp';
import ScheduleStepper from './ScheduleStepper';

moment.locale('zh-TW');

const styles = theme => ({
  card: {
    marginTop: 8,
    marginBottom: 8,
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    // [theme.breakpoints.up('sm')]: {
    //   marginRight: -8,
    // },
    marginRight: 8,
    [theme.breakpoints.up('sm')]: {
      marginRight: 0,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: blue[500],
  },
  headerAction: {
    // marginTop: 'unset',
    marginTop: 'auto',
    marginBottom: 'auto',
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
  linkBtn: {
    verticalAlign: 'baseline',
  },
});

class ScheduleCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, schedule } = this.props;

    let time = '<unknown>';
    if (schedule && schedule.nextScheduledTime) {
      time = `於 ${moment(schedule.nextScheduledTime).fromNow()} 執行`;
    }
    let executor = '<unknown>';
    if (schedule && schedule.executor) {
      executor = `${schedule.executor.name}`;
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={(
              <Avatar aria-label="Recipe" className={classes.avatar}>
                S
              </Avatar>
            )}
            classes={{
              root: classes.headerRoot,
              action: classes.headerAction,
              content: classes.headerContent,
            }}
            action={(
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
            title={schedule.title}
            subheader={(
              <Typography
                variant="body1"
                component="pre"
                color="textSecondary"
              >
                {`${time} - `}
                <ButtonBase
                  className={classes.linkBtn}
                >
                  <Typography
                    variant="body1"
                    component="pre"
                    color="textSecondary"
                  >
                    <Link key="terms" text={`[${executor}]`} />
                  </Typography>
                </ButtonBase>
              </Typography>
            )}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent
              classes={{
                root: classes.contentRoot,
              }}
            >
              <ScheduleStepper schedule={schedule} />
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ScheduleCard);
