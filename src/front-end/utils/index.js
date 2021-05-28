import moment from 'moment';

export const getDisplayTime = timeStr => timeStr ? moment(timeStr).format('YYYY/MM/DD[\n]HH:mm:ss') : 'N/A';
