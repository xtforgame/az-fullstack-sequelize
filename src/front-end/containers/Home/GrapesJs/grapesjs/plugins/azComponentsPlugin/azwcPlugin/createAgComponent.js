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
      // render({ el, model, className, prefix: ppfx }) {
      //   const label = model.get('label');
      //   const media = model.get('media');
      //   el.innerHTML = `
      //     ${media ? `<div class="${className}__media">${media}</div>` : ''}
      //     <div class="${className}-label">${label}</div>
      //     <i class="${className}-custom__edit is-abs--b-r u-p--xs fa fa-pencil is-clickable is-anim"></i>
      //   `;
      //   const editButton = el.querySelector(`.${className}-custom__edit`);
      //   editButton.onclick = (e) => {
      //     alert(label);
      //   };
      //   return '';
      // },
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
