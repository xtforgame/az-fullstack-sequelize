
// http://stackoverflow.com/questions/20100245/how-can-i-execute-array-of-promises-in-sequential-order
/*

If you have an array of promise returning functions:

var tasks = [fn1, fn2, fn3...];

tasks.reduce(function(cur, next) {
    return cur.then(next);
}, RSVP.resolve()).then(function() {
    //all executed
});
Or values:

var idsToDelete = [1,2,3];

idsToDelete.reduce(function(cur, next) {
    return cur.then(function() {
        return http.post("/delete.php?id=" + next);
    });
}, RSVP.resolve()).then(function() {
    //all executed
});

*/

export type ToPromiseFunction<T> = (_ : any, value : T, index : number, array : T[]) => any;


export function defaultToPromiseFunc<T>(_ : any, value : T, index : number, array : T[]) {
  return Promise.resolve(value);
}

export function toSeqPromise<T>(
  inArray : T[],
  toPrmiseFunc : ToPromiseFunction<T> = defaultToPromiseFunc,
) {
  return inArray.reduce((prev, curr, index, array) => prev.then(() => toPrmiseFunc(prev, curr, index, array)), Promise.resolve());
}

export function promiseReduce<T>(
  inArray : T[],
  toPrmiseFunc : ToPromiseFunction<T> = defaultToPromiseFunc,
  startValue: any,
) {
  return inArray.reduce((prev, curr, index, array) => prev.then(v => toPrmiseFunc(v, curr, index, array)), Promise.resolve(startValue));
}

export function promiseWait(waitMillisec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, waitMillisec);
  });
}

const defaultCallbackPromise = ({ result, error }) => {
  if (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(result);
};

// https://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
const getClass = {}.toString;
function isFunction(object) {
  return object && getClass.call(object) === '[object Function]';
}

function isFunctionV2(object) {
  return typeof object === 'function';
}

const toCamel = str => str.replace(/_([a-z])/g, g => g[1].toUpperCase());
const toUnderscore = str => str.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`);
const capitalizeFirstLetter = str => (str.charAt(0).toUpperCase() + str.slice(1));

const toCurrency = number => number.toFixed().replace(/\d(?=(\d{3})+$)/g, '$&,');
const toFloatCurrency = (v, d = 2) => parseFloat(v).toFixed(d).replace(/\d(?=(\d{3})+\.)/g, '$&,');

export {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
  toCurrency,
  toFloatCurrency,
  defaultCallbackPromise,
  isFunction,
  isFunctionV2,
};

/*
toSeqPromise([1, 2, 3, 4, 5, 6, 7], (_, value) => {
  console.log('value :', value);
  if(value != 5){
    return Promise.resolve(value);
  }
  return Promise.reject(value);
});
*/

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
