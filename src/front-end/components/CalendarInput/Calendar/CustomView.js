import React, { useState } from 'react';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import {
  /* purple, */green, yellow, orange, red, blue, indigo, pink, grey, common,
} from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import * as dates from 'react-big-calendar/lib/utils/dates';
import { Calendar, Views, Navigate } from 'react-big-calendar';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import ConfirmDialogV2 from 'azrmui/core/Dialogs/ConfirmDialogV2';
import useDialogState from 'azrmui/hooks/useDialogState';
import CustomToolbar from './CustomToolbar';
import TimeSelectDialog from './TimeSelectDialog';

const customWeekLength = 5;

const padTime = v => `${v}`.padStart(2, '0');

const formatTime = date => `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;

function Event({ event, ...rest }) {
  let title = null;
  if (!('isAllDay' in rest) && !event.hideTime) {
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
  let backgroundColor = event.selected || event.psychologistSelected ? blue[500] : green[900];
  if (event.clientSelected) {
    backgroundColor = event.selected || event.psychologistSelected ? orange[500] : green[500];
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #265985',
        borderRadius: 5,
        overflow: 'hidden',
        color: 'white',
        backgroundColor,
        margin: 2,
        padding: 2,
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
          {event.desc && `:  ${event.desc}`}
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
  if (date.getDay() === 0 || date.getDay() === 6) {
    return {
      className: 'special-day',
      style: {
        // border: `solid 3px ${date.getDay() === 0 ? '#faa' : '#afa'}`,
        // backgroundColor: date.getDay() === 0 ? '#faa' : '#afa',
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
  if (date.getDay() === 0 || date.getDay() === 6) {
    return {
      className: 'special-day',
      style: {
        // border: `solid 3px ${date.getDay() === 0 ? '#faa' : '#afa'}`,
        backgroundColor: date.getDay() === 0 ? '#faa' : '#afa',
      },
    };
  } else return {};
};

const customSlotPropGetter = (date) => {
  if (date.getDay() === 0 || date.getDay() === 6) {
    return {
      className: 'special-day',
      style: {
        // border: `solid 3px ${date.getDay() === 0 ? '#faa' : '#afa'}`,
        backgroundColor: date.getDay() === 0 ? '#faa' : '#afa',
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
  const end = dates.add(start, customWeekLength - 1, 'day');

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
      return dates.add(date, -customWeekLength, 'day');

    case Navigate.NEXT:
      return dates.add(date, customWeekLength, 'day');

    default:
      return date;
  }
};

MyWeek.title = date => `開始日期: ${date.toLocaleDateString()}`;

const getGroupId = id => id.split(':')[0];
const findGroupIndexRange = (events, gruopId) => {
  let startIndex;
  let endIndex = events.length - 1;
  for (let index = 0; index < events.length; index++) {
    const element = events[index];
    if (startIndex !== undefined && getGroupId(element.id) !== gruopId) {
      endIndex = index;
      break;
    }
    if (startIndex === undefined && getGroupId(element.id) === gruopId) {
      startIndex = index;
    }
  }
  return [startIndex, endIndex];
};
const normalizeEvent = (events) => {
  let prevEvent;
  const newEvents = events.reduce((arr, event) => {
    if (prevEvent
      && event.selected === prevEvent.selected
      && event.clientSelected === prevEvent.clientSelected
      && event.desc === prevEvent.desc
      && event.start.getTime() === prevEvent.end.getTime()) {
      prevEvent.end = event.end;
      return arr;
    }
    prevEvent = event;
    return [...arr, event];
  }, []);
  let currentGroupId;
  let currentGroupIdCounter = 0;
  newEvents.forEach((event) => {
    const groupId = getGroupId(event.id);
    if (groupId !== currentGroupId) {
      currentGroupId = groupId;
      currentGroupIdCounter = 0;
    }
    event.id = `${groupId}:${currentGroupIdCounter}`;
    currentGroupIdCounter++;
  });
  return newEvents;
};

const displayDateTime = dateTime => moment(dateTime).format('YYYY/MM/DD HH:mm');

export default ({
  localizer, dialogProps, date: d, value: events, onChange, disabled,
}) => {
  const startDate = moment(d).startOf('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState(startDate.toDate());
  const minDate = moment(startDate).add(9, 'hours').toDate();
  const maxDate = moment(startDate).add(1, 'month').add(1, 'day').add(22, 'hours')
    .toDate();

  const { t } = useTranslation(['builtin-components']);

  const [{
    exited: exitedAskTime,
    dialogProps: dialogPropsAskTime,
  }, {
    handleOpen: handleOpenAskTime,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    dialogProps,
    open: (v) => {
    },
    close: (v) => {
      if (v && v[0] !== v[1]) {
        const eventIndex = events.findIndex(e => e === selectedEvent);
        const newEvents = [...events];
        const groupId = getGroupId(selectedEvent.id);
        // const range = findGroupIndexRange(newEvents, groupId);
        const newEvent = {
          ...selectedEvent,
          id: groupId,
          title: '已選',
          originalTitle: selectedEvent.title,
          hideTime: true,
          start: moment(v[0]).toDate(),
          end: moment(v[1]).toDate(),
          desc: selectedEvent.desc,
          selected: true,
        };
        if (newEvent.start.getTime() === selectedEvent.start.getTime()) {
          if (newEvent.end.getTime() === selectedEvent.end.getTime()) {
            newEvents.splice(eventIndex, 1, newEvent);
          } else {
            const newSelectedEvent = {
              ...selectedEvent,
              start: moment(newEvent.end).toDate(),
            };
            newEvents.splice(eventIndex, 1, newEvent, newSelectedEvent);
          }
        } else if (newEvent.end.getTime() === selectedEvent.end.getTime()) {
          const newSelectedEvent = {
            ...selectedEvent,
            end: moment(newEvent.start).toDate(),
          };
          newEvents.splice(eventIndex, 1, newSelectedEvent, newEvent);
        } else {
          const newSelectedEvent01 = {
            ...selectedEvent,
            end: moment(newEvent.start).toDate(),
          };
          const newSelectedEvent02 = {
            ...selectedEvent,
            start: moment(newEvent.end).toDate(),
          };
          newEvents.splice(eventIndex, 1, newSelectedEvent01, newEvent, newSelectedEvent02);
        }
        onChange(normalizeEvent(newEvents));
      }
      setSelectedEvent(null);
    },
  });

  const [{
    exited: exitedConfirm,
    dialogProps: dialogPropsConfirm,
  }, {
    handleOpen: handleOpenConfirm,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    dialogProps,
    open: (v) => {
    },
    close: (v) => {
      if (v) {
        const event = events.find(e => e === selectedEvent);
        event.title = event.originalTitle;
        delete event.selected;
        onChange(normalizeEvent(events));
      }
    },
  });

  return (
    <React.Fragment>
      <Calendar
        // selectable
        onSelectEvent={(event) => {
          if (disabled) {
            return;
          }
          setSelectedEvent(event);
          if (!event.selected) {
            handleOpenAskTime();
          } else {
            handleOpenConfirm();
          }
        }}
        onShowMore={(events) => {
          console.log('events :', events);
          alert(events.length);
        }}
        events={events}
        localizer={localizer}
        defaultView={Views.WEEK}
        // defaultDate={new Date(2015, 3, 1)}
        date={date}
        onNavigate={(date) => {
          if (date.getTime() < minDate.getTime()) {
            return setDate(minDate);
          } else if (date.getTime() > maxDate.getTime()) {
            return setDate(maxDate);
          }
          return setDate(date);
        }}
        min={minDate}
        max={maxDate}
        views={{ week: MyWeek, agenda: true }}
        eventPropGetter={customEventPropGetter}
        dayPropGetter={customDayPropGetter}
        slotPropGetter={customSlotPropGetter}
        components={{
          week: {
            header: ({ date, localizer }) => {
              const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
              return `${date.getDate()}(${weekdays[date.getDay()]})`;
              // localizer.format(date, 'dddd')
            },
          },
          event: Event,
          agenda: {
            event: EventAgenda,
          },
          toolbar: CustomToolbar,
        }}
      />
      {(!exitedAskTime) && (
        <TimeSelectDialog
          title="選取時段"
          selectedEvent={selectedEvent}
          {...dialogPropsAskTime}
        />
      )}
      {(!exitedConfirm) && (
        <ConfirmDialogV2
          title="取消選取時段"
          contentText={`您確定要取消以下時段？ (${selectedEvent && displayDateTime(selectedEvent.start)} 至 ${selectedEvent && displayDateTime(selectedEvent.end)})`}
          buttonTexts={{
            yes: t('confirmOK'),
            no: t('confirmCancel'),
          }}
          {...dialogPropsConfirm}
        />
      )}
    </React.Fragment>
  );
};


// https://stackoverflow.com/questions/42119581/react-big-calendar-navigate-to-specific-day-month
// <BigCalendar
//   selectable
//   events={events}
//   defaultView='week'
//   date={this.state.selectedDay}
//   onNavigate={date => {
//     this.setState({ selectedDate: date });
//   }}
// />
