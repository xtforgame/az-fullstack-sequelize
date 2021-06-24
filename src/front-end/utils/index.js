import moment from 'moment';
import { asTwTime } from 'common/utils/time-helpers';

export const getDisplayTime = timeStr => timeStr ? asTwTime(timeStr).format('YYYY/MM/DD[\n]HH:mm:ss') : 'N/A';
