import { addAzwcDialogType, addAzwcDialogBlock } from './components/azwc-dialog';
import { addAzwcFileManagerType, addAzwcFileManagerBlock } from './components/azwc-file-manager';

export const addTypes = (editor, options) => {
  addAzwcDialogType(editor, options);
  addAzwcFileManagerType(editor, options);
};

export const addBlocks = (editor, options) => {
  addAzwcDialogBlock(editor, options);
  addAzwcFileManagerBlock(editor, options);
};
