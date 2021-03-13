// https://github.com/artf/grapesjs/issues/324
import styleManagerCfg from './styleManagerCfg';

export const azStyleManagerPlugin = (editor, options = {}) => {
  const sm = editor.StyleManager;
  const { sectors } = styleManagerCfg;
  sm.getSectors().reset(sectors);
};

export default azStyleManagerPlugin;

grapesjs.plugins.add('az-style-manager', azStyleManagerPlugin);
