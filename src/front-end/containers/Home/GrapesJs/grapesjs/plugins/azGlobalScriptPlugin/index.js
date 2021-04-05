import grapesjs from 'grapesjs';
import globalScript from './global-script-core';

export const azGlobalScriptPlugin = (editor, options) => {
  editor.Commands.add('open-event-binder', {
    run(editor, sender, data) {
      const component = editor.getSelected();
      options.openEventsBinder({ component });
    },
  });
  globalScript(editor, options);
};

export default azGlobalScriptPlugin;

grapesjs.plugins.add('az-global-script', azGlobalScriptPlugin);
