import gtb from './grapesjs-html-block';
import addTraits from './addTraits';
import hacks from './some-hacks';


export const azCommonPlugin = (editor, options) => {
  console.log('options :', options);
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
  hacks(editor, options);

  // https://github.com/artf/grapesjs-preset-webpage/blob/master/src/consts.js
  const crc = 'create-comp';
  const mvc = 'move-comp';
  const swv = 'sw-visibility';
  const expt = 'export-template';
  const osm = 'open-sm';
  const otm = 'open-tm';
  const ola = 'open-layers';
  const obl = 'open-blocks';
  const ful = 'fullscreen';
  const prv = 'preview';

  const cmdImport = 'gjs-open-import-webpage';
  const cmdDeviceDesktop = 'set-device-desktop';
  const cmdDeviceTablet = 'set-device-tablet';
  const cmdDeviceMobile = 'set-device-mobile';
  const cmdClear = 'canvas-clear';

  editor.on('load', () => {
    editor.Panels.getButton('options', 'sw-visibility').set('active', true);
  });

  editor.Panels.removeButton('options', cmdImport);

  // editor.Panels.removeButton('options', swv);
  // editor.Panels.removeButton('options', prv);
  // editor.Panels.removeButton('options', ful);
  editor.Panels.removeButton('options', expt);
  // editor.Panels.removeButton('options', cmdClear);
};

export default azCommonPlugin;

grapesjs.plugins.add('az-common', azCommonPlugin);
