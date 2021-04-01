export default (editor, options) => {
  const traverseComponent = (component, i, a) => {
    const cb = (component, i, a) => {
      if (component.type === 'textnode') {
        console.log('component.content :', component.content);
        return { tagName: 'azxxx', components: [] };
      }
      return traverseComponent(component, i, a);
    };
    const newComponent = { ...component };
    if (newComponent.components) {
      if (Array.isArray(newComponent.components)) {
        newComponent.components = newComponent.components.map(cb);
      } else {
        newComponent.components = cb(newComponent.components);
      }
    }
    return newComponent;
  };

  // https://github.com/artf/grapesjs/blob/master/src/parser/index.js
  // https://github.com/artf/grapesjs/blob/master/src/parser/model/ParserHtml.js
  editor.Parser.parseHtml = (str) => {
    const {
      em, compTypes, parserHtml, parserCss,
    } = editor.Parser;
    // console.log('parserHtml');
    // console.log('str :', str);
    parserHtml.compTypes = em ? em.get('DomComponents').getTypes() : compTypes;
    const result = parserHtml.parse(str, parserCss);
    // result.html = traverseComponent(result.html);
    return result;
  };

  // =========================================
  // do not select any class by default

  const sm = editor.SelectorManager;
  console.log('sm :', sm.selectorTags);

  sm.prevCids = [];

  // https://github.com/artf/grapesjs/blob/d2ded38edcb2400e8fd4a11c28f84de12a6d540e/src/selector_manager/view/ClassTagsView.js
  const { updateSelection } = sm.selectorTags;
  sm.selectorTags.updateSelection = function (targets) {
    let trgs = targets || this.getTargets();
    trgs = Array.isArray(trgs) ? trgs : [trgs];
    let selectors = [];
    if (trgs.length !== sm.prevCids.length || trgs.find((t, i) => t.cid !== sm.prevCids[i])) {
      if (trgs && trgs.length) {
        selectors = this.getCommonSelectors({ targets: trgs });
        this.checkSync({ validSelectors: selectors });
      }
      selectors.forEach(model => model.set('active', false));
      sm.prevCids = trgs.map(t => t.cid);
    }
    return updateSelection.call(this, targets);
  };

  // ====================================

  const cmdAzDeviceDesktop = 'set-device-desktop';
  const cmdAzDeviceSmallDesktop = 'set-device-small-desktop';
  const cmdAzDeviceTablet = 'set-device-tablet';
  const cmdAzDeviceMobile = 'set-device-mobile';

  const deviceManager = editor.DeviceManager;
  deviceManager.add('az-desktop', '', {
    name: 'AzDesktop',
  });
  deviceManager.add('az-small-desktop', '1200px', {
    name: 'AzSmallDesktop',
    widthMedia: '1280px', // the width that will be used for the CSS media
  });
  deviceManager.add('az-tablet', '768px', {
    height: '1024px',
    name: 'AzTablet',
    widthMedia: '960px', // the width that will be used for the CSS media
  });
  deviceManager.add('az-mobile', '375px', {
    height: '667px',
    name: 'AzMobile',
    widthMedia: '600px', // the width that will be used for the CSS media
  });

  editor.Panels.getPanels().forEach(item => console.log(item.get('id')));
  const pnm = editor.Panels;
  const panelDevices = pnm.getPanel('devices-c');
  console.log('panelDevices :', panelDevices);
  const deviceBtns = panelDevices.get('buttons');
  deviceBtns.reset();
  deviceBtns.add([{
    id: cmdAzDeviceDesktop,
    command: cmdAzDeviceDesktop,
    className: 'fa fa-desktop',
    active: 1,
  }, {
    id: cmdAzDeviceSmallDesktop,
    command: cmdAzDeviceSmallDesktop,
    className: 'fa fa-desktop',
    active: 0,
  }, {
    id: cmdAzDeviceTablet,
    command: cmdAzDeviceTablet,
    className: 'fa fa-tablet',
    active: 0,
  }, {
    id: cmdAzDeviceMobile,
    command: cmdAzDeviceMobile,
    className: 'fa fa-mobile',
    active: 0,
  }]);

  const cm = editor.Commands;
  cm.add(cmdAzDeviceDesktop, {
    run(e) {
      e.setDevice('AzDesktop');
    },
    stop() {},
  });
  cm.add(cmdAzDeviceSmallDesktop, {
    run(e) {
      e.setDevice('AzSmallDesktop');
    },
    stop() {},
  });
  cm.add(cmdAzDeviceTablet, {
    run(e) {
      e.setDevice('AzTablet');
    },
    stop() {},
  });
  cm.add(cmdAzDeviceMobile, {
    run(e) {
      e.setDevice('AzMobile');
    },
    stop() {},
  });
  // ================================
  // https://github.com/artf/grapesjs-preset-webpage/blob/master/src/consts.js
  const crc = 'create-comp';
  const mvc = 'move-comp';
  const swv = 'sw-visibility';
  const expt = 'export-template';
  const osm = 'open-sm';
  const otm = 'open-tm';
  const ola = 'open-layers';
  const obl = 'open-blocks';
  const ful = 'fullscreen';
  const prv = 'preview';

  const cmdImport = 'gjs-open-import-webpage';
  const cmdDeviceDesktop = 'set-device-desktop';
  const cmdDeviceTablet = 'set-device-tablet';
  const cmdDeviceMobile = 'set-device-mobile';
  const cmdClear = 'canvas-clear';

  editor.Panels.getButton('options', 'sw-visibility').set('active', true);
  editor.Panels.removeButton('options', cmdImport);

  // editor.Panels.removeButton('options', swv);
  // editor.Panels.removeButton('options', prv);
  // editor.Panels.removeButton('options', ful);
  editor.Panels.removeButton('options', expt);
  // editor.Panels.removeButton('options', cmdClear);
};
