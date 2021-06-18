/* eslint-disable import/no-webpack-loader-syntax, no-param-reassign, no-unused-vars, no-lonely-if */

import runOnceScript from 'raw-loader!./run-once-script';
import updateScript from 'raw-loader!./update-script';

export class GlobalScriptManager {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = options;
    this.allowScripts = this.editor.getConfig().allowScripts;
    this.components = new Map();
    this.mainComponent = null;
    this.hasRunOnce = false;
  }

  registerComponent(component) {
    this.unregisterComponent(component);
    this.components.set(component.cid, component);
    if (
      !this.mainComponent
      || (this.mainComponent && this.mainComponent.cid === component.cid)
    ) {
      this.mainComponent = component;
    }
  }

  unregisterComponent(component) {
    this.components.delete(component.cid);
    if (this.components.size === 0) {
      this.mainComponent = null;
      return;
    }
    if (this.mainComponent && this.mainComponent.cid === component.cid) {
      this.components.forEach((c) => {
        this.mainComponent = c;
      });
    }
  }

  handleUpdate() {
    const components = this.editor.getComponents();
    const lastComponent = components.models[components.length - 1];
    if (
      !lastComponent || !this.mainComponent
      || lastComponent.cid !== this.mainComponent.cid
    ) {
      console.log('reset global script');
      this.components.forEach((c) => {
        // c.remove({ temporary: true });
        c.remove();
      });
      // this.editor.addComponents('<script data-global-script=""></script>');

      this.editor.addComponents({
        type: 'global-script',
        tagName: 'script',
        // content: '{}',
      });
      console.log('reset global script done');
    } else {
      this.hasRunOnce = true;
    }
  }
}

export default (editor, options) => {
  const globalScriptManager = new GlobalScriptManager(editor, options);
  editor.globalScriptManager = globalScriptManager;

  const costomRunOnceScript = options.runOnceScript || '';
  const costomUpdateScript = options.updateScript || '';
  const getScripts = (onlyUpdate) => {
    if (onlyUpdate) {
      return `${updateScript}${costomUpdateScript}`;
    }
    return `${runOnceScript}${costomRunOnceScript}${updateScript}${costomUpdateScript}`;
  };
  // ================================
  function addGlobalScriptEditor() {
    // editor.Commands.add('open-global-script-editor', {
    //   run(editor, sender, data) {
    //     const component = editor.getSelected();

    //     const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
    //     codeViewer.set({
    //       codeName: 'htmlmixed',
    //       theme: 'hopscotch',
    //       readOnly: false,
    //     });

    //     const modalContent = document.createElement('div');

    //     const editorTextArea = document.createElement('textarea');

    //     const saveButton = document.createElement('button');
    //     saveButton.innerHTML = 'Save';
    //     saveButton.className = 'gjs-btn-prim';
    //     saveButton.style = 'margin-top: 8px;';
    //     saveButton.onclick = function () {
    //       // component.set('content', '');
    //       // component.components(codeViewer.editor.getValue());
    //       component.components(''); // you really shouldn't need this... try removing it and see if it causes any issues
    //       component.set('content', codeViewer.editor.getValue());
    //       editor.Modal.close();
    //     };

    //     modalContent.appendChild(editorTextArea);
    //     modalContent.appendChild(saveButton);

    //     codeViewer.init(editorTextArea);

    //     let htmlContent = document.createElement('div');
    //     htmlContent.innerHTML = component.toHTML();
    //     htmlContent = htmlContent.firstChild.innerHTML;
    //     codeViewer.setContent(htmlContent);

    //     editor.Modal
    //       .setTitle('Edit HTML')
    //       .setContent(modalContent)
    //       .open();

    //     codeViewer.editor.refresh();
    //   },
    // });
  }


  function addGlobalScriptComponent() {
    const defaultType = editor.DomComponents.getType('default');

    // const _initToolbar = defaultType.model.prototype.initToolbar;
    editor.DomComponents.addType('global-script', {
      model: defaultType.model.extend({
        // initToolbar(args) {
        //   _initToolbar.apply(this, args);

        //   const toolbar = this.get('toolbar');
        //   toolbar.push({
        //     attributes: { class: 'fa fa-code' },
        //     command: 'open-global-script-editor',
        //   });
        //   this.set('toolbar', toolbar);
        // },
        defaults: Object.assign({}, defaultType.model.prototype.defaults, {
          // layerable: false,
        }),
        toHTML(opt = {}) {
          // console.log('toHTML');
          return '';
          return `<script data-global-script>${getScripts()}</script>`;
          return defaultType.model.prototype.toHTML
          .call(this, opt)
          .replace(/[\n\s]*<agjc-placeholder[^<]*<\/agjc-placeholder>[\n\s]*/g, '');
        },
        toJSON(opt = {}) {
          // console.log('toJSON');
          const json = defaultType.model.prototype.toJSON.call(this, opt);
          // json.attributes['data-global-script-content'] = getScripts();// json.content;
          json.content = '';
          return json;
        },
        init() {
          // console.log('globalScript init', this.cid);
          // console.log('this.content :', this.get('content'));
          // this.set('content', '');
          const attrs = this.getAttributes();
          if (attrs['data-global-script-content']) {
            console.log('from data-global-script-content');
            this.set('content', attrs['data-global-script-content']);
          } else {
            if (globalScriptManager.hasRunOnce) {
              this.set('content', getScripts(true));
            } else {
              this.set('content', getScripts());
              globalScriptManager.hasRunOnce = true;
            }
          }
          attrs['data-global-script'] = '';
          delete attrs['data-global-script-content'];
          this.setAttributes(attrs);
          globalScriptManager.registerComponent(this);
          this.listenTo(this, 'change:testprop', this.handlePropChange);
        },
        updated(property, value, prevValue) {
        },
        removed() {
          // console.log('globalScript removed', this.cid);
          globalScriptManager.unregisterComponent(this);
        },
        handlePropChange() {
          // console.log('The value of testprop', this.get('testprop'));
        },
      }, {
        isComponent(el) {
          if (typeof el.hasAttribute === 'function' && el.hasAttribute('data-global-script')) {
            // https://github.com/artf/grapesjs/issues/774
            return {
              type: 'global-script',
              content: el.innerHTML,
              components: [], // this will avoid parsing children
            };
          }
          return undefined;
        },
      }),
      view: defaultType.view,
    });
  }

  function addGlobalScriptBlock() {
    editor.BlockManager.add('global-script', {
      category: 'Built-in',
      attributes: { class: 'fa fa-code' },
      label: 'GlobalScript',
      content: '<div data-global-script>Global Script</div>',
    });
  }


  function addCustomScriptComponent() {
    const defaultType = editor.DomComponents.getType('default');

    // const _initToolbar = defaultType.model.prototype.initToolbar;
    editor.DomComponents.addType('custom-script', {
      model: defaultType.model.extend({
        defaults: Object.assign({}, defaultType.model.prototype.defaults, {
          // layerable: false,
        }),
        toHTML(opt = {}) {
          // console.log('toHTML');
          // return `<script data-custom-script>${getScripts()}</script>`;
          return defaultType.model.prototype.toHTML
          .call(this, opt)
          .replace(/[\n\s]*<agjc-placeholder[^<]*<\/agjc-placeholder>[\n\s]*/g, '');
        },
        toJSON(opt = {}) {
          // console.log('toJSON');
          const json = defaultType.model.prototype.toJSON.call(this, opt);
          // json.attributes['data-custom-script-content'] = getScripts();// json.content;
          // json.content = '';
          return json;
        },
        init() {
          // console.log('globalScript init', this.cid);
          // console.log('this.content :', this.get('content'));
          // this.set('content', '');
          const attrs = this.getAttributes();
          if (attrs['data-custom-script-content']) {
            console.log('from data-custom-script-content');
            this.set('content', attrs['data-custom-script-content']);
          }
          attrs['data-custom-script'] = '';
          delete attrs['data-custom-script-content'];
          this.listenTo(this, 'change:testprop', this.handlePropChange);
        },
        updated(property, value, prevValue) {
        },
        removed() {
          // console.log('globalScript removed', this.cid);
          globalScriptManager.unregisterComponent(this);
        },
        handlePropChange() {
          // console.log('The value of testprop', this.get('testprop'));
        },
      }, {
        isComponent(el) {
          if (typeof el.hasAttribute === 'function' && el.hasAttribute('data-custom-script')) {
            // https://github.com/artf/grapesjs/issues/774
            return {
              type: 'custom-script',
              content: el.innerHTML,
              components: [], // this will avoid parsing children
            };
          }
          return undefined;
        },
      }),
      view: defaultType.view,
    });
  }

  // addGlobalScriptEditor();
  addGlobalScriptComponent();
  // addGlobalScriptBlock();

  addCustomScriptComponent();

  // ============================

  // const domComponents = editor.DomComponents;
  // const wrapper = domComponents.getWrapper();
  // wrapper.set('style', { 'background-color': 'red' });
  // wrapper.set('attributes', { title: 'Hello!' });
  // console.log('editor.getWrapper() :', editor.getWrapper());

  editor.on('update', (...args) => {
    console.log('globalScriptManager.handleUpdate');
    const storageManager = editor.StorageManager;
    storageManager.setAutosave(false);
    const um = editor.UndoManager;
    um.stop();
    globalScriptManager.handleUpdate();
    um.start();

    // const selected = editor.getSelected();
    // selected.remove({ temporary: true }); // temporary option will avoid removing component related styles
    // editor.getWrapper().append(selected, { at: 0 });
  });
};
