import modelMap from './modelMap';

const {
  createSessionEpic,
  readSessionCollEpic,
} = modelMap.epics;

export default [
  createSessionEpic,
  readSessionCollEpic,
];
