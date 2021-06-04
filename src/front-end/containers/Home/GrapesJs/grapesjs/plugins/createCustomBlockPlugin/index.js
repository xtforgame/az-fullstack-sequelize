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
  const btnSave = document.createElement('button');
  const btnReplace = document.createElement('button');
  btnReplace.style.float = 'right';

  let allRules = [];

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

  btnSave.innerHTML = 'Save';
  btnSave.className = `${pfx}btn-prim ${pfx}btn-import`;
  btnSave.onclick = function () {
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

  btnReplace.innerHTML = 'Replace';
  btnReplace.className = `${pfx}btn-prim ${pfx}btn-import`;
  btnReplace.onclick = function () {
    // const doReplace = confirm('Replace?');
    // if (!doReplace) {
    //   return;
    // }

    const allRulesMain = editor.CssComposer.getAll();
    allRulesMain.remove(allRules);

    // const component = editor.getSelected();
    // const html = htmlCodeViewer.editor.getValue();
    // component.components(html);

    const component = editor.getSelected();
    const parent = component.parent();
    if (parent) {
      const html = htmlCodeViewer.editor.getValue();
      // https://github.com/artf/grapesjs/issues/1077
      const coll = component.collection;
      const at = coll.indexOf(component);
      coll.remove(component);
      coll.add(html, { at });
    }


    const allRulesPe = previewEditor.CssComposer.getAll();
    allRulesPe.forEach((rule) => {
      const mediaText = rule.get('mediaText');
      const style = rule.get('style');
      const cc = editor.CssComposer;
      const selectorsString = rule.selectorsToString();
      if (mediaText) {
        const r = cc.setRule(selectorsString, style, {
          atRuleType: 'media',
          atRuleParams: mediaText,
        });
      } else {
        const cc = editor.CssComposer;
        const r = cc.setRule(selectorsString, style);
      }
    });
    modal.close();
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
        container.appendChild(btnSave);
        container.appendChild(btnReplace);
        htmlCodeViewer.init(txtarea);
        cssCodeViewer.init(cssarea);
        htmlViewer = htmlCodeViewer.editor;
        cssViewer = cssCodeViewer.editor;
      }
      // const InnerHtml = editor.getHtml();
      // // var Css = editor.getCss()
      // const Css = editor.getCss({ avoidProtected: true });

      if (previewEditor) {
        // previewEditor.DomComponents.clear(); // Clear components
        // previewEditor.CssComposer.clear(); // Clear styles
        // previewEditor.UndoManager.clear(); // Clear undo history
        // previewEditor.destroy();
        // console.log('previewEditor :', previewEditor);
        bottomContainer.innerHTML = '';
        previewEditor = null;
      }

      const component = editor.getSelected();
      const {
        html: InnerHtml,
        css: Css,
        allRules: ar,
      } = getComponentHtmlCss(editor, component);

      allRules = ar;

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

    // {
    //   // https://github.com/artf/grapesjs/issues/789
    //   const getAllComponents = (model, result = []) => {
    //     result.push(model);
    //     model.components().each(mod => getAllComponents(mod, result))
    //     return result;
    //   };
    //   const all = getAllComponents(editor.DomComponents.getWrapper());
    //   all.forEach((ac) => {
    //     const { ccid } = ac;
    //     // https://github.com/artf/grapesjs/issues/3000
    //     const willBeRemoveRules = editor.CssComposer.getRule(`#${ccid}`);
    //     console.log('willBeRemoveRules :', willBeRemoveRules);
    //     if (willBeRemoveRules) {
    //       const ss = willBeRemoveRules.selectorsToString().split(',');
    //       console.log('ss :', ss);
    //       willBeRemoveRules.setStyle({});

    //       const cc = editor.CssComposer;
    //       // Simple class-based rule
    //       const rule = cc.setRule('.class1.class2', { color: 'red' });
    //       console.log(rule.toCSS()) // output: .class1.class2 { color: red }
    //       // With state and other mixed selector
    //       const rule1 = cc.setRule('.class1.class2:hover, div#myid', { color: 'red' });
    //       // output: .class1.class2:hover, div#myid { color: red }
    //       // With media
    //       const rule2 = cc.setRule('.class1:hover', { color: 'red' }, {
    //         atRuleType: 'media',
    //         atRuleParams: '(min-width: 500px)',
    //       });
    //     }
    //     // const allRules = editor.CssComposer.getAll();
    //     // allRules.remove(willBeRemoveRules);
    //   });
    // }

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
