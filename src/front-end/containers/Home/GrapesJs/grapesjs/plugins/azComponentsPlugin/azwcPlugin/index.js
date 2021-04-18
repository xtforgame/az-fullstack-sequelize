import { AzwcGlobal } from 'xbase/dist/custom-elements';
import { addAzwcDialogType, addAzwcDialogBlock } from './components/azwc-dialog';
import { addAzwcFileManagerType, addAzwcFileManagerBlock } from './components/azwc-file-manager';
import createAgComponent from './createAgComponent';

const AzwcComponentNames = [
  'AzwcAccordion',
  'AzwcCanviDrawer',
  'AzwcCollapseT1',
  'AzwcDialog',
  'AzwcFileManager',
  'AzwcNavButton',
  'AzwcSpinner',
  'AzwcSpinnerMask',
  'AzwcSwiper',
];

const { Components } = AzwcGlobal.exports.exportData;

const agComponentInfos = AzwcComponentNames.map(componentName => createAgComponent(componentName, Components[componentName], {}));

export const addTypes = (editor, options) => {
  agComponentInfos.forEach(({ addType }) => addType(editor, options));
  // addAzwcDialogType(editor, options);
  // addAzwcFileManagerType(editor, options);
};

export const addBlocks = (editor, options) => {
  agComponentInfos.forEach(({ addBlock }) => addBlock(editor, options));
  // addAzwcDialogBlock(editor, options);
  // addAzwcFileManagerBlock(editor, options);
};
