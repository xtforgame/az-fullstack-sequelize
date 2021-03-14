import grapesjs from 'grapesjs';
import LocalStorageProvider from './LocalStorageProvider';
import ProviderBase from './ProviderBase';

export {
  LocalStorageProvider,
  ProviderBase,
};

export const azSimpleStoragePlugin = (editor, options = {}) => {
  // Here our `simple-storage` implementation
  const provider = options.provider || new LocalStorageProvider();
  provider.init(editor, options);
  editor.StorageManager.add('simple-storage', {
    /**
     * Load the data
     * @param  {Array} keys Array containing values to load, eg, ['gjs-components', 'gjs-styles', ...]
     * @param  {Function} clb Callback function to call when the load is ended
     * @param  {Function} clbErr Callback function to call in case of errors
     */
    load(keys, clb, clbErr) {
      provider.load(keys, clb, clbErr);
    },

    /**
     * Store the data
     * @param  {Object} data Data object to store
     * @param  {Function} clb Callback function to call when the load is ended
     * @param  {Function} clbErr Callback function to call in case of errors
     */
    store(data, clb, clbErr) {
      provider.store(data, clb, clbErr);
    },
  });

  // Add the button
  editor.Panels.addButton('options', [{
    id: 'save-db',
    className: 'fa fa-save',
    command: 'save-db',
    attributes: { title: 'Save' },
  }]);

  // Add the command
  editor.Commands.add('save-db', {
    run(editor, sender) {
      sender && sender.set('active', 0); // turn off the button
      editor.store();
    },
  });

  // Add the button
  editor.Panels.addButton('options', [{
    id: 'load-db',
    className: 'fa fa-folder-open',
    command: 'load-db',
    attributes: { title: 'Load' },
  }]);

  // Add the command
  editor.Commands.add('load-db', {
    run(editor, sender) {
      sender && sender.set('active', 0); // turn off the button
      editor.load();
    },
  });
};

export default azSimpleStoragePlugin;

grapesjs.plugins.add('az-simple-storage', azSimpleStoragePlugin);
