import ProviderBase from './ProviderBase';

export default class LocalStorageProvider extends ProviderBase {
  init(editor, options = {}) {

  }

  load(keys, clb, clbErr) {
    const result = {};

    keys.forEach((key) => {
      // const value = SimpleStorage[key];
      const value = localStorage.getItem(key);
      if (value) {
        result[key] = JSON.parse(value);
      }
    });

    // Might be called inside some async method
    clb(result);
  }

  /**
   * Store the data
   * @param  {Object} data Data object to store
   * @param  {Function} clb Callback function to call when the load is ended
   * @param  {Function} clbErr Callback function to call in case of errors
   */
  store(data, clb, clbErr) {
    Object.keys(data).forEach((key) => {
      // SimpleStorage[key] = data[key];
      localStorage.setItem(key, JSON.stringify(data[key]));
    });
    // Might be called inside some async method
    clb();
  }
}
