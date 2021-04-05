import { AzwcDialog, AzwcGlobal } from 'xbase/dist/custom-elements';
// import { exportData } from 'xbase/dist/types/global';
import getDefaultCompTypeOptions from './getDefaultCompTypeOptions';

export function addAzwcDialogType(editor, config = {}) {
  // console.log('AzwcDialog.allInstances :', AzwcDialog.allInstances);
  // console.log('AzwcDialog.DestinationInfoMap :', AzwcDialog.DestinationInfoMap);
  // console.log('AzwcGlobal.exports :', AzwcGlobal.exports);
  editor.DomComponents.addType('AgDialog', getDefaultCompTypeOptions(editor, {
    defaults: {
      droppable: '.nothing',
    },
    tagName: 'azwc-dialog',
    typeName: 'AgDialog',
  }));
}


export function addAzwcDialogBlock(editor, config = {}) {
  const bm = editor.BlockManager;
  const category = config.category || 'Basic';
  bm.add('AgDialog', {
    category,
    attributes: { class: 'fa fa-link' },
    label: 'AgDialog',
    content: `<azwc-dialog class="az-dialog">
      <agjc-slot class="az-slot-bg1" slot="top">
      </agjc-slot>
      <agjc-slot class="az-slot-bg2" slot="body">
      </agjc-slot>
    </azwc-dialog>`,
  });
}
