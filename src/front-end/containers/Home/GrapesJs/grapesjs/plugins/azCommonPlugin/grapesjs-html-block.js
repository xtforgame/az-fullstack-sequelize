export default (editor, options) => {
  // ================================
  // https://github.com/ryandeba/grapesjs-html-block
  function addHTMLCodeEditor() {
    editor.Commands.add('open-html-code-editor', {
      run(editor, sender, data) {
        const component = editor.getSelected();

        const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
        codeViewer.set({
          codeName: 'htmlmixed',
          theme: 'hopscotch',
          readOnly: false,
        });

        const modalContent = document.createElement('div');

        const editorTextArea = document.createElement('textarea');

        const saveButton = document.createElement('button');
        saveButton.innerHTML = 'Save';
        saveButton.className = 'gjs-btn-prim';
        saveButton.style = 'margin-top: 8px;';
        saveButton.onclick = function () {
          // component.set('content', '');
          // component.components(codeViewer.editor.getValue());
          component.components(''); // you really shouldn't need this... try removing it and see if it causes any issues
          component.set('content', codeViewer.editor.getValue());
          editor.Modal.close();
        };

        modalContent.appendChild(editorTextArea);
        modalContent.appendChild(saveButton);

        codeViewer.init(editorTextArea);

        let htmlContent = document.createElement('div');
        htmlContent.innerHTML = component.toHTML();
        htmlContent = htmlContent.firstChild.innerHTML;
        codeViewer.setContent(htmlContent);

        editor.Modal
          .setTitle('Edit HTML')
          .setContent(modalContent)
          .open();

        codeViewer.editor.refresh();
      },
    });
  }

  function addHTMLCodeComponent() {
    const defaultType = editor.DomComponents.getType('default');

    const _initToolbar = defaultType.model.prototype.initToolbar;
    editor.DomComponents.addType('html-code', {
      model: defaultType.model.extend({
        initToolbar(args) {
          _initToolbar.apply(this, args);

          const toolbar = this.get('toolbar');
          toolbar.push({
            attributes: { class: 'fa fa-code' },
            command: 'open-html-code-editor',
          });
          this.set('toolbar', toolbar);
        },
        defaults: Object.assign({}, defaultType.model.prototype.defaults, {
          // layerable: false,
        }),
      }, {
        isComponent(el) {
          if (typeof el.hasAttribute === 'function' && el.hasAttribute('data-html-code')) {
            // https://github.com/artf/grapesjs/issues/774
            return {
              type: 'html-code',
              content: el.innerHTML,
              components: [], // this will avoid parsing children
            };
          }
        },
      }),
      view: defaultType.view,
    });
  }

  function addHTMLCodeBlock() {
    editor.BlockManager.add('html-code', {
      category: 'Custom',
      attributes: { class: 'fa fa-code' },
      label: 'HTML Code',
      content: '<div data-html-code>Edit my HTML content</div>',
    });
  }

  addHTMLCodeEditor();
  addHTMLCodeComponent();
  addHTMLCodeBlock();
};
