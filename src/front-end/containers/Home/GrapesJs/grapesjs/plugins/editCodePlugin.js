// https://github.com/artf/grapesjs/issues/324
export const azEditCodePlugin = (editor, options = {}) => {
  const pfx = editor.getConfig().stylePrefix;
  const modal = editor.Modal;
  const cmdm = editor.Commands;
  const pnm = editor.Panels;
  const container = document.createElement('div');
  const btnEdit = document.createElement('button');

  const cssCodeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
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
  let htmlCodeViewer;
  if (!options.cssOnly) {
    htmlCodeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
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
  }

  btnEdit.innerHTML = 'Save';
  btnEdit.className = `${pfx}btn-prim ${pfx}btn-import`;
  btnEdit.onclick = function () {
    editor.DomComponents.getWrapper().set('content', '');
    if (!options.cssOnly) {
      const html = htmlCodeViewer.editor.getValue();
      editor.setComponents(html.trim());
    }
    const css = cssCodeViewer.editor.getValue();
    editor.setStyle(css);
    modal.close();
  };

  cmdm.add('edit-code', {
    run(editor, sender) {
      sender && sender.set('active', 0);
      let htmlViewer;
      if (!options.cssOnly) {
        htmlViewer = htmlCodeViewer.editor;
      }
      let cssViewer = cssCodeViewer.editor;
      modal.setTitle('Edit code');
      if (!htmlViewer && !cssViewer) {
        let txtarea;
        if (!options.cssOnly) {
          txtarea = document.createElement('textarea');
          container.appendChild(txtarea);
        }
        const cssarea = document.createElement('textarea');
        container.appendChild(cssarea);
        container.appendChild(btnEdit);
        if (!options.cssOnly) {
          htmlCodeViewer.init(txtarea);
          htmlViewer = htmlCodeViewer.editor;
        }
        cssCodeViewer.init(cssarea);
        cssViewer = cssCodeViewer.editor;
      }
      modal.setContent('');
      modal.setContent(container);
      if (!options.cssOnly) {
        const InnerHtml = editor.getHtml();
        htmlCodeViewer.setContent(InnerHtml);
      }
      const Css = editor.getCss({ avoidProtected: true });
      cssCodeViewer.setContent(Css);
      modal.open();
      if (!options.cssOnly) {
        htmlViewer.refresh();
      }
      cssViewer.refresh();
    },
  });

  pnm.addButton('options',
    [
      {
        id: 'edit-code',
        className: 'fa fa-edit',
        command: 'edit-code',
        attributes: {
          title: 'Edit Code',
        },
      },
    ]);
};

export default azEditCodePlugin;

grapesjs.plugins.add('az-edit-code', azEditCodePlugin);
