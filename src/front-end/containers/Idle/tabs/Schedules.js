/* eslint-disable no-console */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FlipMove from 'react-flip-move';
import ScheduleCard from '../Bot/ScheduleCard';
import botPastureStatus from '../botPastureStatus';

const styles = {
};

class Schedules extends React.Component {
  render() {
    const status = botPastureStatus && botPastureStatus.status;
    const schedules = (status && status.schedules) || [];
    // console.log('status, schedules :', status, schedules);
    // console.log('schedules :', schedules);
    return (
      <FlipMove>
        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
          />
        ))}
      </FlipMove>
    );
  }
}

export default withStyles(styles)(Schedules);
