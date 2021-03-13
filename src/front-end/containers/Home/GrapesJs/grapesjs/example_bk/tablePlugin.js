// from https://github.com/artf/grapesjs/issues/1632
export default (config = {}) => (editor) => {
  const blockManager = editor.BlockManager;
  blockManager.add('table-block', {
    id: 'table',
    label: 'Table',
    category: 'Basic',
    attributes: { class: 'fa fa-table' },
    // https://github.com/artf/grapesjs/issues/1841
    content: `
        <table class="table table-bordered table-resizable">
          <tr data-gjs-name="Xtr" data-gjs-icon='<i class="fa fa-paint-brush"></i>'><td></td><td></td><td></td></tr>
          <tr data-gjs-name="Xtr" data-gjs-icon='<i class="fa fa-paint-brush"></i>'><td></td><td></td><td></td></tr>
          <tr data-gjs-name="Xtr" data-gjs-icon='<i class="fa fa-paint-brush"></i>'><td></td><td></td><td></td></tr>
        </table>
      `,
  });
  const TOOLBAR_CELL = [
    {
      attributes: { class: 'fa fa-arrow-up' },
      command: 'select-parent',
    },
    {
      attributes: { class: 'fa fa-arrows' },
      command: 'tlb-move',
    },
    {
      attributes: { class: 'fa fa-flag' },
      command: 'table-insert-row-above',
    },

    {
      attributes: { class: 'fa fa-clone' },
      command: 'tlb-clone',
    },
    {
      attributes: { class: 'fa fa-trash-o' },
      command: 'tlb-delete',
    },
  ];
  const getCellToolbar = () => TOOLBAR_CELL;


  const components = editor.DomComponents;
  const text = components.getType('text');
  components.addType('cell', {
    model: text.model.extend({
      defaults: Object.assign({}, text.model.prototype.defaults, {
        type: 'cell',
        tagName: 'td',
        draggable: ['tr'],

      }),
    },
    {
      isComponent(el) {
        let result;
        const tag = el.tagName;
        if (tag == 'TD' || tag == 'TH') {
          result = {
            type: 'cell',
            tagName: tag.toLowerCase(),
          };
        }
        return result;
      },
    }),
    view: text.view,
  });


  editor.on('component:selected', (m) => {
    const compType = m.get('type');
    switch (compType) {
      case 'cell':
        m.set('toolbar', getCellToolbar()); // set a toolbars
    }
  });


  editor.Commands.add('table-insert-row-above', (editor) => {
    const selected = editor.getSelected();

    if (selected.is('cell')) {
      // selected.set('name', 'Xxxxx');
      console.log('selected.get("icon") :', selected.get('icon'));
      selected.set('icon', '<i class="fa fa-paint-brush"></i>');
      const rowComponent = selected.parent();
      const rowIndex = rowComponent.collection.indexOf(rowComponent);
      const cells = rowComponent.components().length;
      const rowContainer = rowComponent.parent();

      rowContainer.components().add({
        type: 'row',
        components: [...Array(cells).keys()].map(i => ({
          type: 'cell',
          content: 'New Cell',
        })),
      }, { at: rowIndex });
    }
  });
};
