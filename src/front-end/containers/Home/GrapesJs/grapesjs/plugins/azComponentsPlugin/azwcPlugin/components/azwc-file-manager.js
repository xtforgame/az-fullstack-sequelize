import getDefaultCompTypeOptions from './getDefaultCompTypeOptions';

export function addAzwcFileManagerType(editor, config = {}) {
  editor.DomComponents.addType('azwc-file-manager-gjc', getDefaultCompTypeOptions(editor, {
    defaults: {
      droppable: '.nothing',
    },
  }));
}

export function addAzwcFileManagerBlock(editor, config = {}) {
  const bm = editor.BlockManager;
  const category = config.category || 'Basic';
  bm.add('azwc-file-manager-gjc', {
    category,
    attributes: { class: 'fa fa-link' },
    label: 'Azwc File Manager',
    content: `<azwc-file-manager class="az-dialog" data-gjs-type="azwc-file-manager-gjc">
      <agjc-slot class="az-slot-bg1" slot="top">
      </agjc-slot>
      <agjc-slot class="az-slot-bg2" slot="body">
      </agjc-slot>
    </azwc-file-manager>`,
  });
}
