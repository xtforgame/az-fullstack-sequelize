import grapesjs from 'grapesjs';
import gtb from './grapesjs-html-block';
import addTraits from './addTraits';

export const azCommonPlugin = (editor, options) => {
  // console.log('options :', options);
  // azCommonPluginComponents(config, editor);

  gtb(editor, options);


  editor.on('component:mount', (component) => {
    const domElement = component.getEl();
    if (domElement && typeof domElement !== 'string') {
      try {
        const display = window.getComputedStyle(domElement).getPropertyValue('display');
        // console.log('display :', display);
        if (display === 'flex') {
          component.set('icon', '<i class="fa fa-paint-brush"></i>');
        }
      } catch (error) {

      }
    }
  });

  addTraits(editor, options);
};

export default azCommonPlugin;

grapesjs.plugins.add('az-common', azCommonPlugin);
