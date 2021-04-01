export default (editor, config = {}) => {
  const script = function () {
    // alert('Hi');
    // `this` is bound to the component element
    console.log('the element', this);
  };
  const defaultType = editor.DomComponents.getType('default');
  const defaults = config.defaults || {};
  return {
    model: {
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
        console.log('Local hook: model.init');
        this.listenTo(this, 'change:testprop', this.handlePropChange);
        // Here we can listen global hooks with editor.on('...')
      },
      updated(property, value, prevValue) {
        console.log('Local hook: model.updated',
          'property', property, 'value', value, 'prevValue', prevValue);
      },
      removed() {
        console.log('Local hook: model.removed');
      },
      handlePropChange() {
        console.log('The value of testprop', this.get('testprop'));
      },
    },
    view: {
      init() {
        console.log('Local hook: view.init');
      },
      onRender({ el }) {
        customElements.whenDefined('azwc-dialog')
        .then((x) => {
          console.log('x :', x);
          let c = el.querySelector('azwc-dialog');
          c = el;
          console.log('c :', c);
          c.componentOnReady()
          .then(() => {
            // setInterval(() => {
            //   c.togglePadding()
            // }, 10000);
            c.setAttribute('first', 'Rick');
            c.setAttribute('middle', 'X');
            c.setAttribute('last', 'Chen');
          });
        });
        // console.log('el :', el.childNodes[0].togglePadding);
        console.log('Local hook: view.onRender');
      },
    },
  };
};
