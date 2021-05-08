/* eslint-disable max-len, no-useless-escape */
// import validator from 'validator';
export const defaultTimeGetter = item => ({ start: item.start, end: item.end });
export const defaultNewItem = (range, srcItem, tarItem, isLeftPart) => ({
  ...srcItem,
  start: range.start,
  end: range.end,
});

export const intersectionSplitItemByItem = (srcItem, tarItem, options) => {
  const {
    timeGetter = defaultTimeGetter,
    newItem = defaultNewItem,
  } = options || {};
  const {
    start: srcStart,
    end: srcEnd,
  } = timeGetter(srcItem);
  const {
    start: tarStart,
    end: tarEnd,
  } = timeGetter(tarItem);
  if (srcStart >= tarEnd || tarStart >= srcEnd) {
    return null;
  }
  if (srcStart >= tarStart) {
    if (srcEnd <= tarEnd) {
      return [newItem({
        start: srcStart,
        end: srcEnd,
      }, srcItem, tarItem, false), null];
    } else {
      return [newItem({
        start: srcStart,
        end: tarEnd,
      }, srcItem, tarItem, false), newItem({
        start: tarEnd,
        end: srcEnd,
      }, srcItem, tarItem, true)];
    }
  } else if (srcEnd <= tarEnd) {
    return [newItem({
      start: tarStart,
      end: srcEnd,
    }, srcItem, tarItem, false), null];
  }
  return [newItem({
    start: tarStart,
    end: tarEnd,
  }, srcItem, tarItem, false), newItem({
    start: tarEnd,
    end: srcEnd,
  }, srcItem, tarItem, true)];
};

export const intersectionSplitItemByArray = (srcItem, tarArray, startFrom = 0, options) => {
  const {
    timeGetter = defaultTimeGetter,
    // newItem = defaultNewItem,
  } = options || {};
  const {
    start: srcStart,
    // end: srcEnd,
  } = timeGetter(srcItem);
  for (let index = startFrom; index < tarArray.length; index++) {
    const tarItem = tarArray[index];
    const {
      // start: tarStart,
      end: tarEnd,
    } = timeGetter(tarItem);
    if (tarEnd <= srcStart) {
      continue;
    }
    const result = intersectionSplitItemByItem(srcItem, tarItem, options);
    if (result) {
      return {
        index,
        result,
      };
    }
  }
  return null;
};

export const getIntersectionArray = (srcArray, tarArray, options) => {
  const newSet = [];
  srcArray.forEach((srcItem) => {
    let part = srcItem;
    let index = 0;
    while (true) {
      const r = intersectionSplitItemByArray(part, tarArray, index, options);
      if (!r) {
        break;
      } else {
        ({ index } = r);
        if (r.result[0]) {
          newSet.push(r.result[0]);
        }
        if (r.result[1]) {
          [, part] = r.result;
        } else {
          break;
        }
      }
    }
  });
  return newSet;
};

export const differenceSplitItemByItem = (srcItem, tarItem, options) => {
  const {
    timeGetter = defaultTimeGetter,
    newItem = defaultNewItem,
  } = options || {};
  const {
    start: srcStart,
    end: srcEnd,
  } = timeGetter(srcItem);
  const {
    start: tarStart,
    end: tarEnd,
  } = timeGetter(tarItem);
  if (srcStart >= tarEnd || tarStart >= srcEnd) {
    return null;
  }
  if (srcStart >= tarStart) {
    if (srcEnd <= tarEnd) {
      return [null, null];
    } else {
      return [null, newItem({

        start: tarEnd,
        end: srcEnd,
      }, srcItem, tarItem, true)];
    }
  } else if (srcEnd <= tarEnd) {
    return [newItem({
      start: srcStart,
      end: tarStart,
    }, srcItem, tarItem, false), null];
  }
  return [newItem({
    start: srcStart,
    end: tarStart,
  }, srcItem, tarItem, false), newItem({
    start: tarEnd,
    end: srcEnd,
  }, srcItem, tarItem, true)];
};

export const differenceSplitItemByArray = (srcItem, tarArray, startFrom = 0, options) => {
  const {
    timeGetter = defaultTimeGetter,
    // newItem = defaultNewItem,
  } = options || {};
  const {
    start: srcStart,
    // end: srcEnd,
  } = timeGetter(srcItem);
  for (let index = startFrom; index < tarArray.length; index++) {
    const tarItem = tarArray[index];
    const {
      // start: tarStart,
      end: tarEnd,
    } = timeGetter(tarItem);
    if (tarEnd <= srcStart) {
      continue;
    }
    const result = differenceSplitItemByItem(srcItem, tarItem, options);
    if (result) {
      return {
        index,
        result,
      };
    }
  }
  return null;
};

export const getDifferenceArray = (srcArray, tarArray, options) => {
  const newSet = [];
  srcArray.forEach((srcItem) => {
    let part = srcItem;
    let index = 0;
    while (true) {
      const r = differenceSplitItemByArray(part, tarArray, index, options);
      if (!r) {
        newSet.push(part);
        break;
      } else {
        ({ index } = r);
        // console.log('r.result :', r.result);
        if (r.result[0]) {
          newSet.push(r.result[0]);
        }
        if (r.result[1]) {
          [, part] = r.result;
        } else {
          break;
        }
      }
    }
  });
  return newSet;
};
