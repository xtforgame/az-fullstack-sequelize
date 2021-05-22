/* eslint-disable max-len, no-useless-escape */
// import validator from 'validator';
export type Interval = {
  start: number,
  end: number,
}

export const defaultTimeGetter = <IntervalType extends Interval>(item: IntervalType) => ({ start: item.start, end: item.end });
export const defaultNewItem = <IntervalType extends Interval>(range: Interval, srcItem: IntervalType, tarItem: IntervalType, isLeftPart: boolean) => ({
  ...srcItem,
  start: range.start,
  end: range.end,
});

export type Option<IntervalType extends Interval> = {
  timeGetter: (item: IntervalType) => Interval;
  newItem: (range: Interval, srcItem: IntervalType, tarItem: IntervalType, isLeftPart: boolean) => IntervalType;
}

export type SplitItemByItemResultType<IntervalType extends Interval> = [IntervalType | null, IntervalType | null];
export type SplitItemByItemResult<IntervalType extends Interval> = null | SplitItemByItemResultType<IntervalType>;
export type SplitItemByItemResultWithIndex<IntervalType extends Interval> = null | {
  result: SplitItemByItemResultType<IntervalType>,
  index: number,
};

export const intersectionSplitItemByItem = <IntervalType extends Interval>(srcItem: IntervalType, tarItem: IntervalType, options?: Option<IntervalType>) : SplitItemByItemResult<IntervalType> => {
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

export const intersectionSplitItemByArray = <IntervalType extends Interval>(srcItem: IntervalType, tarArray: IntervalType[], startFrom = 0, options?: Option<IntervalType>) : SplitItemByItemResultWithIndex<IntervalType> => {
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
    const result = intersectionSplitItemByItem<IntervalType>(srcItem, tarItem, options);
    if (result) {
      return {
        index,
        result,
      };
    }
  }
  return null;
};

export const getIntersectionArray = <IntervalType extends Interval>(srcArray: IntervalType[], tarArray: IntervalType[], options?: Option<IntervalType>) : IntervalType[] => {
  const newSet: IntervalType[] = [];
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

// ======================

export const differenceSplitItemByItem = <IntervalType extends Interval>(srcItem: IntervalType, tarItem: IntervalType, options?: Option<IntervalType>) : SplitItemByItemResult<IntervalType> => {
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

export const differenceSplitItemByArray = <IntervalType extends Interval>(srcItem: IntervalType, tarArray: IntervalType[], startFrom = 0, options?: Option<IntervalType>) : SplitItemByItemResultWithIndex<IntervalType> => {
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

export const getDifferenceArray = <IntervalType extends Interval>(srcArray: IntervalType[], tarArray: IntervalType[], options?: Option<IntervalType>) : IntervalType[] => {
  const newSet : IntervalType[] = [];
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
