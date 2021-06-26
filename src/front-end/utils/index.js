import moment from 'moment';
import { asTwTime } from 'common/utils/time-helpers';

export const getDisplayTime = timeStr => timeStr ? asTwTime(timeStr).format('YYYY/MM/DD[\n]HH:mm:ss') : 'N/A';


// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

// https://github.com/casesandberg/react-color/blob/master/src/helpers/color.js
export const getContrastingColor = (data) => {
  const result = hexToRgb(data);
  if (!result) {
    return '#fff';
  }
  const yiq = ((result.r * 299) + (result.g * 587) + (result.b * 114)) / 1000;
  return (yiq >= 128) ? '#000' : '#fff';
};
