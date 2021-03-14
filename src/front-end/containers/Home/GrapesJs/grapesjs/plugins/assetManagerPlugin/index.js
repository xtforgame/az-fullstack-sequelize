import grapesjs from 'grapesjs';

export const azAssetManagerPlugin = (editor, options = {}) => {
  // https://github.com/artf/grapesjs/issues/491#issuecomment-342813486
  // const am = editor.AssetManager;
  // am.add([
  //   {
  //     // You can pass any custom property you want
  //     category: 'c1',
  //     src: 'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
  //   }, {
  //     category: 'c1',
  //     src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
  //   }, {
  //     category: 'c2',
  //     src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
  //   },
  // ]);
  // const assets = am.getAll();
  // am.render([assets.filter(
  //   asset => asset.get('category') === 'c1'
  // )]);
  // am.getAll().length // Still have 3 assets
  // am.getAllVisible().length // but only 2 are shown
  // am.render();


  // https://grapesjs.com/docs/modules/Commands.html#extending
  // https://github.com/artf/grapesjs/issues/491#issuecomment-342813486
  // https://github.com/artf/grapesjs/blob/e921165a8d681b5d1056c816f88dd7719d4f61e0/src/dom_components/view/ComponentImageView.js#L68
  // https://github.com/artf/grapesjs/blob/dev/src/commands/view/OpenAssets.js

  editor.Commands.add('open-assets', {
    run(editor, sender, opts = {}) {
      const modal = editor.Modal;
      const am = editor.AssetManager;
      const config = am.getConfig();
      const amContainer = am.getContainer();
      const title = opts.modalTitle || editor.t('assetManager.modalTitle') || '';
      const { types } = opts;
      const { accept } = opts;

      am.setTarget(opts.target);
      am.onClick(opts.onClick);
      am.onDblClick(opts.onDblClick);
      am.onSelect(opts.onSelect);

      if (!this.rendered || types) {
        let assets = am.getAll().filter(i => 1);

        if (types && types.length) {
          assets = assets.filter(a => types.indexOf(a.get('type')) !== -1);
        }

        am.render(assets);
        this.rendered = 1;
      }

      if (accept) {
        const uploadEl = amContainer.querySelector(
          `input#${config.stylePrefix}uploadFile`
        );
        uploadEl && uploadEl.setAttribute('accept', accept);
      }

      modal
        .open({
          title,
          content: amContainer,
        })
        .getModel()
        .once('change:open', () => editor.stopCommand(this.id));
      return this;
    },

    stop(editor) {
      editor.Modal.close();
      return this;
    },
  });
};

export default azAssetManagerPlugin;

grapesjs.plugins.add('az-asset-manager', azAssetManagerPlugin);
