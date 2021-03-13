export default class ProviderBase {
  init(editor, options = {}) {

  }

  load(keys, clb, clbErr) {
    clb({});
  }

  /**
   * Store the data
   * @param  {Object} data Data object to store
   * @param  {Function} clb Callback function to call when the load is ended
   * @param  {Function} clbErr Callback function to call in case of errors
   */
  store(data, clb, clbErr) {
    clb();
  }
}
