// https://github.com/artf/grapesjs/issues/324
import grapesjs from 'grapesjs';

import getComponentHtmlCss from '../../utils/getComponentHtmlCss';

export const azCreateCustomBlockPlugin = (editor, options = {}) => {
  const { manager } = options;

  let previewEditor;
  const pfx = editor.getConfig().stylePrefix;
  const modal = editor.Modal;
  const cmdm = editor.Commands;
  const htmlCodeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  const cssCodeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
  const pnm = editor.Panels;
  const container = document.createElement('div');
  const componentNameInputWrapper = document.createElement('div');
  componentNameInputWrapper.innerHTML = `
    <div class="custom-component-inputs" style="margin: 8px; width: 300px;">
      <input class="custom-component" style="width: 100%" placeholder="輸入元件名稱"/>
    </div>
  `;
  const componentNameInput = componentNameInputWrapper.children[0].children[0];
  container.appendChild(componentNameInputWrapper);
  const topContainer = document.createElement('div');
  topContainer.style.display = 'flex';
  container.appendChild(topContainer);
  const bottomContainer = document.createElement('div');
  bottomContainer.style.height = '480px';
  bottomContainer.style.padding = '20px';
  bottomContainer.classList.add('azgjs-view');
  container.appendChild(bottomContainer);
  const leftContainer = document.createElement('div');
  leftContainer.style.flex = 1;
  topContainer.appendChild(leftContainer);
  const rightContainer = document.createElement('div');
  rightContainer.style.flex = 1;
  topContainer.appendChild(rightContainer);
  const btnEdit = document.createElement('button');

  htmlCodeViewer.set({
    codeName: 'htmlmixed',
    readOnly: 0,
    theme: 'hopscotch',
    autoBeautify: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    styleActiveLine: true,
    smartIndent: true,
    indentWithTabs: true,
  });

  cssCodeViewer.set({
    codeName: 'css',
    readOnly: 0,
    theme: 'hopscotch',
    autoBeautify: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    styleActiveLine: true,
    smartIndent: true,
    indentWithTabs: true,
  });

  btnEdit.innerHTML = 'Save';
  btnEdit.className = `${pfx}btn-prim ${pfx}btn-import`;
  btnEdit.onclick = function () {
    const exCfg = {
      category: 'Custom',
      attributes: { class: 'fa fa-link' },
    };
    const componentName = componentNameInput.value.trim();
    if (!componentName) {
      alert('請輸入元件名稱');
      return;
    }
    console.log('componentName :', componentName);
    if (manager) {
      const html = htmlCodeViewer.editor.getValue();
      const css = cssCodeViewer.editor.getValue();
      manager.onSave({
        componentName,
        html,
        htmlCodeViewer,
        css,
        cssCodeViewer,
        editor,
        exCfg,
      })
      .then(() => {
        componentNameInput.value = '';
        modal.close();
      })
      .catch(e => null);
    } else {
      const html = htmlCodeViewer.editor.getValue();
      const css = cssCodeViewer.editor.getValue();
      const bm = editor.BlockManager;
      bm.add(componentName, {
        ...exCfg,
        label: componentName,
        content: `${html}<style>${css}</style>`,
      });
      bm.render();
      // editor.DomComponents.getWrapper().set('content', '');
      // editor.setComponents(html.trim());
      // editor.setStyle(css);
      componentNameInput.value = '';
      modal.close();
    }
  };

  cmdm.add('az-create-custom-block', {
    run(editor, sender) {
      let htmlViewer = htmlCodeViewer.editor;
      let cssViewer = cssCodeViewer.editor;
      modal.setTitle('Save Custom Block');
      if (!htmlViewer && !cssViewer) {
        const txtarea = document.createElement('textarea');
        const cssarea = document.createElement('textarea');

        leftContainer.appendChild(txtarea);
        rightContainer.appendChild(cssarea);
        container.appendChild(btnEdit);
        htmlCodeViewer.init(txtarea);
        cssCodeViewer.init(cssarea);
        htmlViewer = htmlCodeViewer.editor;
        cssViewer = cssCodeViewer.editor;
      }
      // const InnerHtml = editor.getHtml();
      // // var Css = editor.getCss()
      // const Css = editor.getCss({ avoidProtected: true });

      if (previewEditor) {
        previewEditor.DomComponents.clear(); // Clear components
        previewEditor.CssComposer.clear(); // Clear styles
        previewEditor.UndoManager.clear(); // Clear undo history
        previewEditor.destroy();
        bottomContainer.innerHTML = '';
        previewEditor = null;
      }

      const component = editor.getSelected();
      const {
        html: InnerHtml,
        css: Css,
      } = getComponentHtmlCss(editor, component);

      modal.setContent('');
      modal.setContent(container);
      htmlCodeViewer.setContent(InnerHtml);
      cssCodeViewer.setContent(Css);
      modal.open();
      htmlViewer.refresh();
      cssViewer.refresh();

      htmlViewer.on('change', (cm, change) => {
        const html = htmlViewer.getValue();
        if (previewEditor) {
          previewEditor.setComponents(html.trim());
        }
      });

      cssViewer.on('change', (cm, change) => {
        const css = cssViewer.getValue();
        if (previewEditor) {
          previewEditor.setStyle(css);
        }
      });
      const previewarea = document.createElement('div');
      bottomContainer.appendChild(previewarea);
      previewarea.id = 'az-gjs-preview';

      previewEditor = grapesjs.init({
        // Indicate where to init the editor. You can also pass an HTMLElement
        container: `#${'az-gjs-preview'}`,
        // Get the content for the canvas directly from the element
        // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
        fromElement: true,
        // Size of the editor
        height: '440px',
        width: 'auto',
        // Disable the storage manager for the moment
        storageManager: false,
        // Avoid any default panel
        panels: { defaults: [] },
        // plugins: ['gjs-preset-webpage'],
      });
      previewEditor.on('load', () => {
        previewEditor.runCommand('sw-visibility');
      });
      previewEditor.setComponents(InnerHtml);
      previewEditor.setStyle(Css);
    },
  });

  // pnm.addButton('options',
  //   [
  //     {
  //       id: 'az-create-custom-block',
  //       className: 'fa fa-save',
  //       command: 'az-create-custom-block',
  //       attributes: {
  //         title: 'Save Custom Block',
  //       },
  //     },
  //   ]);

  editor.on('component:selected', (m) => {
    // whenever a component is selected in the editor
    // set your command and icon here
    const commandToAdd = 'az-create-custom-block';
    const commandIcon = 'fa fa-share-square';

    // get the selected componnet and its default toolbar
    const selectedComponent = editor.getSelected();
    const defaultToolbar = selectedComponent.get('toolbar');

    // check if this command already exists on this component toolbar
    const commandExists = defaultToolbar.some(item => item.command === commandToAdd);

    // if it doesn't already exist, add it
    if (!commandExists) {
      selectedComponent.set({
        toolbar: [
          ...defaultToolbar,
          {
            id: 'az-create-custom-block',
            className: commandToAdd,
            command: 'az-create-custom-block',
            attributes: {
              class: commandIcon,
              title: 'Save Custom Block',
            },
          },
        ],
      });
    }
  });
};

export default azCreateCustomBlockPlugin;

grapesjs.plugins.add('az-create-custom-block', azCreateCustomBlockPlugin);
