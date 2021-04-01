import getDefaultCompTypeOptions from './getDefaultCompTypeOptions';

export function addAzwcDialogType(editor, config = {}) {
  editor.DomComponents.addType('azwc-dialog-gjc', getDefaultCompTypeOptions(editor, {
    defaults: {
      droppable: '.nothing',
    },
  }));
}


export function addAzwcDialogBlock(editor, config = {}) {
  const bm = editor.BlockManager;
  const category = config.category || 'Basic';
  bm.add('azwc-dialog-gjc', {
    category,
    attributes: { class: 'fa fa-link' },
    label: 'Azwc Dialog',
    content: `<azwc-dialog class="az-dialog" data-gjs-type="azwc-dialog-gjc">
      <agjc-slot class="az-slot-bg1" slot="top">
      </agjc-slot>
      <agjc-slot class="az-slot-bg2" slot="body">
      </agjc-slot>
    </azwc-dialog>`,
  });
}
