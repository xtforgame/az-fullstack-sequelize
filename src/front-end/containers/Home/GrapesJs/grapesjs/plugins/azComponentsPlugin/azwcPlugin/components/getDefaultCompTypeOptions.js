export default (editor, config = {}) => {
  const defaultType = editor.DomComponents.getType('default');
  const defaults = config.defaults || {};
  const extraProps = {};
  if (config.tagName && config.typeName) {
    const tagName = config.tagName.toUpperCase();
    extraProps.isComponent = function isComponent(el) {
      let result;
      const tag = el.tagName;
      if (tag === tagName) {
        result = {
          type: config.typeName,
        };
      }
      return result;
    };
  }

  const originalInitToolbar = defaultType.model.prototype.initToolbar;
  return {
    ...extraProps,
    model: {
      initToolbar(args) {
        originalInitToolbar.apply(this, args);

        const toolbar = this.get('toolbar');
        if (!toolbar.find(item => item.command === 'open-event-binder')) {
          toolbar.push({
            attributes: { class: 'fa fa-plug' },
            command: 'open-event-binder',
          });
          this.set('toolbar', toolbar);
        }
      },
      defaults,
      // defaults: {
      //   // script,
      //   testprop: 1,
      // },
      // toHTML(opt = {}) {
      //   return defaultType.model.prototype.toHTML
      //   .call(this, opt)
      //   .replace(/[\n\s]*<agjc-placeholder[^<]*<\/agjc-placeholder>[\n\s]*/g, '');
      // },
      // toJSON(opt = {}) {
      //   console.log('toJSON');
      //   return defaultType.model.prototype.toJSON.call(this, opt);
      // },
      init() {
        // console.log('init this :', this);
        // console.log('Local hook: model.init');
        // setTimeout(() => {
        //   this.set('name', 'Xxxxxxxx');
        //   editor.refresh();
        // }, 3000);
        const attrs = this.getAttributes();
        if (!attrs.id) {
          attrs.id = editor.DomComponents.Component.createId(this);
          this.setAttributes(attrs);
        }
        this.listenTo(this, 'change:testprop', this.handlePropChange);
        // Here we can listen global hooks with editor.on('...')
      },
      updated(property, value, prevValue) {
        // console.log('Local hook: model.updated', 'property', property, 'value', value, 'prevValue', prevValue);
      },
      removed() {
        // console.log('removed this :', this);
        // console.log('Local hook: model.removed');
      },
      handlePropChange() {
        console.log('The value of testprop', this.get('testprop'));
      },
    },
    view: {
      init() {
        // console.log('Local hook: view.init');
      },
      onRender({ el }) {
        // customElements.whenDefined('azwc-dialog')
        // .then((x) => {
        //   console.log('x :', x);
        //   let c = el.querySelector('azwc-dialog');
        //   c = el;
        //   c.componentOnReady()
        //   .then(() => {
        //     // setInterval(() => {
        //     //   c.togglePadding()
        //     // }, 10000);
        //     c.setAttribute('first', 'Rick');
        //     c.setAttribute('middle', 'X');
        //     c.setAttribute('last', 'Chen');
        //   });
        // });


        // console.log('el :', el.childNodes[0].togglePadding);
        // console.log('Local hook: view.onRender');
      },
    },
  };
};
