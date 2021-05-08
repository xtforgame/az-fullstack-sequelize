import React from 'react';
import { momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
import CustomView from './CustomView';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

export default props => (
  <div style={{ height: 700 }}>
    <CustomView localizer={localizer} {...props} />
  </div>
);
