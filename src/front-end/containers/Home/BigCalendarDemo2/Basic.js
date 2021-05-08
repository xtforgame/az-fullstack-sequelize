import React from 'react';
import { Calendar, Views } from 'react-big-calendar';
import * as dates from 'react-big-calendar/lib/utils/dates';
import events from './events';

const allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({ children }) => React.cloneElement(React.Children.only(children), {
  style: {
    backgroundColor: 'lightblue',
  },
});

const Basic = ({ localizer }) => (
  <Calendar
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    max={dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours')}
    defaultDate={new Date(2015, 3, 1)}
    components={{
      timeSlotWrapper: ColoredDateCellWrapper,
    }}
    localizer={localizer}
  />
);

export default Basic;
