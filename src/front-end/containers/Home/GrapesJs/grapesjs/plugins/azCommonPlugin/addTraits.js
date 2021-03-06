export default (editor, options) => {
  editor.TraitManager.addType('href-next', {
    // Expects as return a simple HTML string or an HTML element
    // createLabel({ label }) {
    //   return `<div>
    //     <div>Before</div>
    //     ${label}
    //     <div>After</div>
    //   </div>`;
    // },
    // noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }) {
      // Here we can decide to use properties from the trait
      const traitOpts = trait.get('options') || [];
      const options = traitOpts.length ? traitOpts : [
        { id: 'url', name: 'URL' },
        { id: 'email', name: 'Email' },
      ];

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.innerHTML = `
        <select class="href-next__type">
          ${options.map(opt => `<option value="${opt.id}">${opt.name}</option>`).join('')}
        </select>
        <div class="href-next__url-inputs">
          <input class="href-next__url" placeholder="Insert URL"/>
        </div>
        <div class="href-next__email-inputs">
          <input class="href-next__email" placeholder="Insert email"/>
          <input class="href-next__email-subject" placeholder="Insert subject"/>
        </div>
      `;

      // Let's make our content interactive
      const inputsUrl = el.querySelector('.href-next__url-inputs');
      const inputsEmail = el.querySelector('.href-next__email-inputs');
      const inputType = el.querySelector('.href-next__type');
      inputType.addEventListener('change', (ev) => {
        switch (ev.target.value) {
          case 'url':
            inputsUrl.style.display = '';
            inputsEmail.style.display = 'none';
            break;
          case 'email':
            inputsUrl.style.display = 'none';
            inputsEmail.style.display = '';
            break;
        }
      });

      return el;
    },
    onEvent({ elInput, component, event }) {
      const inputType = elInput.querySelector('.href-next__type');
      let href = '';

      switch (inputType.value) {
        case 'url':
          const valUrl = elInput.querySelector('.href-next__url').value;
          href = valUrl;
          break;
        case 'email':
          const valEmail = elInput.querySelector('.href-next__email').value;
          const valSubj = elInput.querySelector('.href-next__email-subject').value;
          href = `mailto:${valEmail}${valSubj ? `?subject=${valSubj}` : ''}`;
          break;
      }

      editor.getSelected().setStyle({ display: 'flex' });

      component.addAttributes({ href });
      // const attr = component.getAttributes();
      // delete attr.href;
      // component.setAttributes(attr);
    },
  });

  editor.on('component:mount', (component) => {
    {
      let changed = false;
      const attrs = component.getAttributes();
      const name = component.get('name');
      if (name && attrs['data-gjs-name'] !== name) {
        attrs['data-gjs-name'] = name;
        changed = true;
      }
      const type = component.get('type');
      if (type && attrs['data-gjs-type'] !== type) {
        attrs['data-gjs-type'] = type;
        changed = true;
      }
      if (changed) {
        component.setAttributes(attrs);
      }
    }
    {
      const attrs = component.getAttributes();
      if (attrs['data-agjs-css']) {
        const parsed = editor.Parser.parseHtml(attrs['data-agjs-css']);
        const selectorManager = editor.SelectorManager;
        const css = parsed.css.filter((c) => {
          const selectors = selectorManager.get(c.selectors);
          // console.log('selectors :', selectors);
          const existedRule = editor.CssComposer.getRule(selectors.map(s => s.getFullName({})).join(', '));
          // console.log('existedRule :', existedRule);
          return !existedRule;
        });

        editor.CssComposer.addCollection(css, {
          // ...opt,
          extend: 1,
        });
        delete attrs['data-agjs-css'];
        component.setAttributes(attrs);
      }
    }
  });

  const defaultType = editor.DomComponents.getType('default');
  const _initialize = defaultType.model.prototype.initialize;
  defaultType.model.prototype.initialize = function () {
    _initialize.apply(this, arguments);

    // this.get('traits').add({
    //   type: 'href-next',
    //   name: 'href',
    //   label: 'New href',
    // });
  };

  // const domComponents = editor.DomComponents;
  // domComponents.getTypes().map((type) => {
  //   domComponents.addType(type.id, {
  //     model: {
  //       defaults: {
  //         traits: [
  //           ...domComponents.getType(type.id).model.prototype.defaults.traits,
  //           {
  //             type: 'href-next',
  //             name: 'href',
  //             label: 'New href',
  //           },
  //         ],
  //       },
  //     },
  //   });
  // });
};
