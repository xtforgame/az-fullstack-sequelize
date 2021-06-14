
// https://stackoverflow.com/questions/51851677/how-to-get-argument-types-from-function-in-typescript/51851844
export type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U: never;

// https://stackoverflow.com/questions/50011616/typescript-change-function-type-so-that-it-returns-new-value
export type ReturnType<T> = T extends (...args: infer U) => infer R ? R: never;
export type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
export type WithOptional = ReplaceReturnType<(n?: number) => string, Promise<string>>;

// https://juejin.im/post/5cb96c65e51d4578c35e7287
export type OmitNever<T> = Pick<T, {[P in keyof T]: T[P] extends never ? never : P}[keyof T]>;

// https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type Override<T, R> = Omit<T, keyof R> & R;

export type GetConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never;

export interface Constructor<T> {
  new (...args): T;
}

export interface ConstructorWithFunction<T, ConstructorFunction> {
  new (...args : ArgumentTypes<ConstructorFunction>): T;
}

// ================
// https://stackoverflow.com/questions/60323726/typescript-add-one-argument-to-a-functions-params

export type Cons<H, T extends readonly any[]> = ((head: H, ...tail: T) => void) extends ((...cons: infer R) => void) ? R : never;

export type Push<T extends readonly any[], V>
  = T extends any ? Cons<void, T> extends infer U ?
  { [K in keyof U]: K extends keyof T ? T[K] : V } : never : never;

// final type you need
export type AddArgument<F, Arg> = F extends ((...args: infer PrevArgs) => infer R)
  ? (...args: Push<PrevArgs, Arg>) => R : never

// function type with added boolean argument at the end
// type SomeFunc = (a: string, b: number, c: string) => number;
// type NewFunction = AddArgument<SomeFunc, boolean>
// (head: boolean, a: string, b: number, c: string) => number;


// ================

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

export function toMap<T1, T2 = T1>(
  inArray : T1[],
  getId : (t: T1, i: number, array: T1[]) => any,
  trans : (t: T1, i: number, array: T1[]) => T2 = (t => <T2><any>t),
) {
  return inArray.reduce((prev, curr, index, array) => {
    prev[getId(curr, index, array)] = trans(curr, index, array);
    return prev;
  }, <{ [s: string]: T2 }>{});
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


const leftJustify = function (s, length, char) {
  const fill : any[] = [];
  while (fill.length + s.length < length) {
    fill[fill.length] = char;
  }
  return fill.join('') + s;
};

const rightJustify = function (s, length, char) {
  const fill : any[] = [];
  while (fill.length + s.length < length) {
    fill[fill.length] = char;
  }
  return s + fill.join('');
};

export {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
  toCurrency,
  toFloatCurrency,
  defaultCallbackPromise,
  isFunction,
  isFunctionV2,

  leftJustify,
  rightJustify,
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
