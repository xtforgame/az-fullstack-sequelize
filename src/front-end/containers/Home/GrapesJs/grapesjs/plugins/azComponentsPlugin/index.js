import grapesjs from 'grapesjs';
import agc1 from './agc1';
import {
  addTypes,
  addBlocks,
} from './azwcPlugin';

export const azComponentsPlugin = (editor, options) => {
  const defaultType = editor.DomComponents.getType('default');
  const createCommonCompTypeOptions = (editor, name, config = {}) => {
    const defaults = config.defaults || {};
    const typeName = config.typeName || name;
    const tagName = name.toUpperCase();
    return {
      isComponent(el) {
        if (el.tagName === tagName) {
          return { type: typeName };
        }
      },
      model: {
        defaults,
      },
      view: {
      },
    };
  };

  editor.DomComponents.addType('agjc-box', {
    model: {
      defaults: Object.assign({}, defaultType.model.prototype.defaults, {
        type: 'agjc-box',
        tagName: 'div',
      }),
    },
    isComponent(el) {
      // if (el.tagName === 'DIV' && !el.hasAttribute('data-aztext')) {
      //   return { type: 'agjc-box' };
      // }
      if (el.tagName === 'DIV' && el.hasAttribute('data-azbox')) {
        return { type: 'agjc-box' };
      }
    },
    view: defaultType.view,
  });

  agc1.forEach((c) => {
    // console.log('c :', c);
    editor.BlockManager.add(c.name, c.grapesjsData);
  });

  editor.BlockManager.add('agjc-box', {
    category: 'Built-in',
    attributes: { class: 'gjs-fonts gjs-f-b1' },
    label: 'Box',
    content: '<div data-azbox></div>',
  });

  editor.DomComponents.addType('agjc-slot', createCommonCompTypeOptions(editor, 'agjc-slot', {
    defaults: {
      droppable: true,
      draggable: false,
      removable: false,
      copyable: false,
      editable: false,
      // selectable: false,
      // hoverable: false,
    },
  }));

  editor.DomComponents.addType('agjc-placeholder', createCommonCompTypeOptions(editor, 'agjc-placeholder', {
    defaults: {
      selectable: false,
      hoverable: false,
      layerable: false,
      draggable: false,
      removable: false,
    },
  }));

  addTypes(editor, { category: 'Agc1' });

  addBlocks(editor, { category: 'Agc1' });
};

export default azComponentsPlugin;

grapesjs.plugins.add('az-components', azComponentsPlugin);
