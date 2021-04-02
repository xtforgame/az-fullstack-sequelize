import getDefaultCompTypeOptions from './getDefaultCompTypeOptions';

export function addAzwcFileManagerType(editor, config = {}) {
  editor.DomComponents.addType('AgFileManager', getDefaultCompTypeOptions(editor, {
    defaults: {
      droppable: '.nothing',
      tagName: 'azwc-file-manager',
      typeName: 'AgFileManager',
    },
  }));
}

export function addAzwcFileManagerBlock(editor, config = {}) {
  const bm = editor.BlockManager;
  const category = config.category || 'Basic';
  bm.add('AgFileManager', {
    category,
    attributes: { class: 'fa fa-link' },
    label: 'AgFileManager',
    content: `<azwc-file-manager class="az-dialog">
      <agjc-slot class="az-slot-bg1" slot="top">
      </agjc-slot>
      <agjc-slot class="az-slot-bg2" slot="body">
      </agjc-slot>
    </azwc-file-manager>`,
  });
}
