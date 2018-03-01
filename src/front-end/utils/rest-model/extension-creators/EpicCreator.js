import { Observable } from 'rxjs';
import { promiseWait } from 'common/utils';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import ActionTypesCreator from './ActionTypesCreator';
import ActionsCreator from './ActionsCreator';
import UrlInfo from '../UrlInfo';

export default class EpicCreator {
  static $name = 'epics';

  create({ ns, names, url, getShared, methodConfigs }, config){
    let shared = {};
    let exposed = {};

    const {
      getHeaders = () => ({}),
    } = config;

    methodConfigs.forEach(methodConfig => {
      if(methodConfig.name === 'clear'){
        return ;
      }
      let actionTypes = getShared(ActionTypesCreator.$name)[methodConfig.name];
      let actions = getShared(ActionsCreator.$name)[methodConfig.name];
      // console.log('actionTypes :', actionTypes);
      // console.log('actions :', actions);

      let arg = {
        methodName: methodConfig.name,
        names,
      };

      if(!methodConfig.getEpicName || !methodConfig.getUrlTemplate){
        return { shared, exposed };
      }

      const epicName = methodConfig.getEpicName(arg);
      const urlInfo = new UrlInfo(methodConfig.getUrlTemplate({url, names}));

      shared[methodConfig.name] = (action$, store) => {
        return action$.ofType(actionTypes.start)
          .mergeMap(action => {
            const url = urlInfo.compile(action.urlParams);
            const source = axios.CancelToken.source();
            return Observable.fromPromise(
              //promiseWait(1000)
              promiseWait(0)
              .then(() => {
                let result = axios({
                  method: methodConfig.method,
                  url,
                  headers: getHeaders(),
                  data: action.data,
                  cancelToken: source.token,
                });
                // source.cancel('Operation canceled by the user.');
                return result;
              })
            )
            .map(response => {
              // console.log('response :', response);
              // const pathArray = urlInfo.urlParamsToArray(action.urlParams);
              const timestamp = new Date().getTime();
              return actions.success(
                response.data,
                action.urlParams,
                {
                  // pathArray,
                  timestamp,
                }
              );
            })
            .catch(error => {
              console.log('error :', error);
              return Observable.of(actions.error())
            })
            .race(
              action$.filter(action => {
                // TODO checking more conditions for avoiding canceling all action with the same action type
                return action.type === actionTypes.cancel;
              })
                .map(() => {
                  source.cancel('Operation canceled by the user.');
                  return actions.clearError();
                })
                .take(1)
            )
          })/*
          .mergeMap(action => {
            console.log('action :', action);
            return [action];
          })*/;
      };
      exposed[epicName] = shared[methodConfig.name];
    });
    return { shared, exposed };
  }
}
