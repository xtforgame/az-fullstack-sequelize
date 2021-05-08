import React from 'react';
import Button from '@material-ui/core/Button';

import * as dates from 'react-big-calendar/lib/utils/dates';
import { Calendar, Views, Navigate } from 'react-big-calendar';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import CustomToolbar from './CustomToolbar';
import events from './events';

const padTime = v => `${v}`.padStart(2, '0');

const formatTime = date => `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;

function Event({ event, ...rest }) {
  let title = null;
  if (!('isAllDay' in rest)) {
    title = (
      <div
        style={{
          width: '100%',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          // backgroundColor: 'gray',
        }}
      >
        <strong>{`${formatTime(event.start)} - ${formatTime(event.end)}`}</strong>
      </div>
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #265985',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      {title}
      <div
        style={{
          width: '100%', height: '100%',
        }}
      >
        <span>
          <strong>{event.title}</strong>
          {/* {event.desc && `:  ${event.desc}`} */}
        </span>
      </div>
    </div>
  );
}

function EventAgenda({ event }) {
  return (
    <span>
      <Button variant="contained">
        選擇
      </Button>
      <br />
      <em style={{ color: 'magenta' }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
}

const customEventPropGetter = (
  event,
  start,
  end,
  isSelected,
) => {
  const date = start;
  if (date.getDate() === 7 || date.getDate() === 15) {
    return {
      className: 'special-day',
      style: {
        // border: `solid 3px ${date.getDate() === 7 ? '#faa' : '#afa'}`,
        // backgroundColor: date.getDate() === 7 ? '#faa' : '#afa',
      },
    };
  } else return {};
  // if (event.title !== 'xxxx') {
  //   return {
  //     className: 'special-day',
  //     style: {
  //       // border: 'solid 3px #faa',
  //       backgroundColor: '#faa',
  //     },
  //   };
  // } else return {};
};

const customDayPropGetter = (date) => {
  if (date.getDate() === 7 || date.getDate() === 15) {
    return {
      className: 'special-day',
      style: {
        // border: `solid 3px ${date.getDate() === 7 ? '#faa' : '#afa'}`,
        // backgroundColor: date.getDate() === 7 ? '#faa' : '#afa',
      },
    };
  } else return {};
};

const customSlotPropGetter = (date) => {
  if (date.getDate() === 7 || date.getDate() === 15) {
    return {
      className: 'special-day',
      style: {
        // border: `solid 3px ${date.getDate() === 7 ? '#faa' : '#afa'}`,
        backgroundColor: date.getDate() === 7 ? '#faa' : '#afa',
      },
    };
  } else return {};
};

class MyWeek extends React.Component {
  render() {
    const { date } = this.props;
    const range = MyWeek.range(date);

    return <TimeGrid {...this.props} range={range} eventOffset={15} />;
  }
}

MyWeek.range = (date) => {
  const start = date;
  const end = dates.add(start, 4, 'day');

  let current = start;
  const range = [];

  while (dates.lte(current, end, 'day')) {
    range.push(current);
    current = dates.add(current, 1, 'day');
  }

  return range;
};

MyWeek.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -5, 'day');

    case Navigate.NEXT:
      return dates.add(date, 5, 'day');

    default:
      return date;
  }
};

MyWeek.title = date => `開始日期: ${date.toLocaleDateString()}`;

const CustomView = ({ localizer, events }) => (
  <Calendar
    // selectable
    onSelectEvent={event => alert(`${event.title}\n${event.desc}`)}
    onShowMore={(events) => {
      console.log('events :', events);
      alert(events.length);
    }}
    events={events}
    localizer={localizer}
    defaultView={Views.MONTH}
    defaultDate={new Date(2021, 4, 1)}
    min={new Date(2021, 4, 1, 8)}
    max={new Date(2021, 5, 1, 21)}
    views={{ month: true, week: MyWeek, agenda: true }}
    eventPropGetter={customEventPropGetter}
    dayPropGetter={customDayPropGetter}
    slotPropGetter={customSlotPropGetter}
    components={{
      event: Event,
      agenda: {
        event: EventAgenda,
      },
      toolbar: CustomToolbar,
    }}
  />
);

export default CustomView;
