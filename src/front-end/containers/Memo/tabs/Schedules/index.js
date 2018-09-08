/* eslint-disable no-console */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FlipMove from 'react-flip-move';
import ScheduleCard from './ScheduleCard';

const schedules = [
  {
    id: 1,
    title: 'Backup Check',
    executor: {
      id: 'backup-bot',
      name: 'Backup Bot',
    },
    creator: {
      id: 'backup-bot',
      name: 'Backup Bot',
    },
    timeTrigger: 1535079731950,
    nextScheduledTime: 1535079731950,
    createdTime: 1535079331953,
  },
];

const styles = theme => ({
  spaceForFab: {
    width: 1,
    height: theme.spacing.unit * 2 * 2 + 56,
  },
});

class Schedules extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <FlipMove>
          {schedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
            />
          ))}
        </FlipMove>
        <div className={classes.spaceForFab} />
      </div>
    );
  }
}

export default withStyles(styles)(Schedules);
