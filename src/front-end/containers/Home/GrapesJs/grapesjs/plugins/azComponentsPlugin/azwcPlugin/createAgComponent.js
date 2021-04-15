import getDefaultCompTypeOptions from './components/getDefaultCompTypeOptions';

export default (componentName, Component, componentConfig = {}) => {
  const agName = componentName.replace('Azwc', 'Ag');
  const addType = (editor, config = {}) => {
    editor.DomComponents.addType(agName, getDefaultCompTypeOptions(editor, {
      defaults: {
        droppable: '.nothing',
      },
      tagName: Component.is,
      typeName: agName,
    }));
  };

  const addBlock = (editor, config = {}) => {
    const bm = editor.BlockManager;
    const category = config.category || 'Basic';
    bm.add(agName, {
      category,
      attributes: { class: 'fa fa-link' },
      label: agName,
      content: `<${Component.is}></${Component.is}>`,
      // content: `<${Component.is}>
      //   <agjc-slot class="az-slot-bg1" slot="top">
      //   </agjc-slot>
      //   <agjc-slot class="az-slot-bg2" slot="body">
      //   </agjc-slot>
      // </${Component.is}>`,
    });
  };

  return {
    addType,
    addBlock,
  };
};
