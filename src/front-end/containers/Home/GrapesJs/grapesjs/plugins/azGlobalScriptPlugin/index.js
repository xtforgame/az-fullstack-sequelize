import grapesjs from 'grapesjs';
import globalScript from './global-script-core';

export const azGlobalScriptPlugin = (editor, options) => {
  globalScript(editor, options);
};

export default azGlobalScriptPlugin;

grapesjs.plugins.add('az-global-script', azGlobalScriptPlugin);
