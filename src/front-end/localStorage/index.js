import throttle from 'lodash/throttle';
import {
  makeUserSessionSelector,
  makeRememberUserSelector,
} from '~/containers/App/selectors';

const userSessionSelector = makeUserSessionSelector();
const rememberUserSelector = makeRememberUserSelector();

export const loadState = () => {
  try {
    let serializedState = localStorage.getItem('state');
    if(serializedState == null){
      return undefined;
    }
    let global = JSON.parse(serializedState);
    return {
      global,
    };
  }catch(err){
    console.log('err :', err);
    return undefined;
  }
};

export const saveState = state => {
  try {
    // console.log('state :', state);
    let serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  }catch(err){
    console.log('err :', err);
  }
};

export const removeState = () => {
  localStorage.removeItem('state');
};

export const clearState = () => {
  localStorage.clear();
};

const delaySave = throttle(store => {
  let state = store.getState();
  let persistedData = state.get('global');

  if(rememberUserSelector(state) && userSessionSelector(state)){
    saveState(persistedData);
  }else{
    // removeState();
    localStorage.clear();
  }
}, 300);

export const middleware = store => next => action => {
  setTimeout(() => {
    delaySave(store);
  }, 0);
  return next(action);
};
