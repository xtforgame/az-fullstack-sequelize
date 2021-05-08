import React from 'react';
import { momentLocalizer } from 'react-big-calendar';
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'font-awesome/css/font-awesome.min.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './custom.css';

import moment from 'moment';
import CustomView from './CustomView';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

export default () => (
  <div style={{ height: 700 }}>
    <CustomView localizer={localizer} />
  </div>
);
