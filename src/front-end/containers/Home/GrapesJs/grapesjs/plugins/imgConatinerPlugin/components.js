import {
  keyImgConatiner,
  typeImgConatiner,
} from './config';

export default (editor, opts = {}) => {
  const dc = editor.DomComponents;
  const defaultType = dc.getType('default');
  const defaultModel = defaultType.model;
  const { toolbarBtnImgConatiner } = opts;
  let timedInterval;

  dc.addType('script', {
    view: {
      onRender() {
        const isCC = this.model.closestType(typeImgConatiner);
        isCC && (this.el.innerHTML = '');
      },
    },
  });

  dc.addType(typeImgConatiner, {

    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        name: 'Image Container',
        editable: true,
        ...opts.propsImgConatiner,
      },

      /**
       * Initilize the component
       */
      init() {
        this.listenTo(this, `change:${keyImgConatiner}`, this.onImgConatinerChange);
        const initialCode = this.get(keyImgConatiner) || opts.placeholderContent;
        !this.components().length && this.components(initialCode);
        const toolbar = this.get('toolbar');
        const id = 'custom-code';

        // Add the custom code toolbar button if requested and it's not already in
        if (toolbarBtnImgConatiner && !toolbar.filter(tlb => tlb.id === id).length) {
          toolbar.unshift({
            id,
            command: editor => editor.runCommand('open-assets', {
              target: editor.getSelected(),
              types: ['image'],
              accept: 'image/*',
              onSelect: (asset) => {
                const url = typeof asset === 'string' ? asset : asset.get('src');
                console.log('url :', url);
                const style = editor.getSelectedToStyle().getStyle();
                editor.getSelectedToStyle().setStyle({ ...style, 'background-image': `url(${url})` });
                editor.Modal.close();
                editor.AssetManager.setTarget(null);
              },
            }),
            label: `<svg viewBox="0 0 24 24">
              <path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"></path>
            </svg>`,
            ...toolbarBtnImgConatiner,
          });
        }
      },

      /**
       * Callback to launch on keyImgConatiner change
       */
      onImgConatinerChange() {
        this.components(this.get(keyImgConatiner));
      },
    }, {
      /**
       * The component can be used only if requested explicitly via `type` property
       */
      isComponent() {
        return false;
      },
    }),

    view: defaultType.view.extend({
      events: {
        dblclick: 'onActive',
      },

      init() {
        this.listenTo(this.model.components(), 'add remove reset', this.onComponentsChange);
        this.onComponentsChange();
      },

      /**
       * Things to do once inner components of custom code are changed
       */
      onComponentsChange() {
        timedInterval && clearInterval(timedInterval);
        timedInterval = setTimeout(() => {
          const { model } = this;
          const content = model.get(keyImgConatiner) || '';
          let droppable = 1;

          // Avoid rendering codes with scripts
          if (content.indexOf('<script') >= 0) {
            this.el.innerHTML = opts.placeholderScript;
            droppable = 0;
          }

          model.set({ droppable });
        }, 0);
      },

      onActive(ev) {
        ev && ev.stopPropagation();
        // this.model.set('icon', '<i class="fa fa-paint-brush"></i>');
        // editor.LayerManager.render();
        if (editor && this.model.get('editable')) {
          editor.runCommand('open-assets', {
            target: this.model,
            types: ['image'],
            accept: 'image/*',
            onSelect: (asset) => {
              const url = typeof asset === 'string' ? asset : asset.get('src');
              console.log('url :', url);
              const style = editor.getSelectedToStyle().getStyle();
              editor.getSelectedToStyle().setStyle({ ...style, 'background-image': `url(${url})` });
              editor.Modal.close();
              editor.AssetManager.setTarget(null);
            },
          });
        }
        // const target = this.model;
        // this.em.get('Commands').run(commandNameImgConatiner, { target });
      },
    }),
  });
};
