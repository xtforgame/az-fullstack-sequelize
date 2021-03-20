import grapesjs from 'grapesjs';
import hacks from './some-hacks';


export const azFinalizePlugin = (editor, options) => {
  hacks(editor, options);
};

export default azFinalizePlugin;
