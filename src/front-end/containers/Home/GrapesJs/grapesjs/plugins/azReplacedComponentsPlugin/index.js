import grapesjs from 'grapesjs';
import ComponentVideo from './ComponentVideo';
import ComponentVideoView from './ComponentVideoView';

export const azReplacedComponentsPlugin = (editor, options) => {
  editor.DomComponents.addType('video', {
    model: ComponentVideo(editor, options),
    view: ComponentVideoView(editor, options),
  });
};

export default azReplacedComponentsPlugin;

grapesjs.plugins.add('az-replaced-components', azReplacedComponentsPlugin);
