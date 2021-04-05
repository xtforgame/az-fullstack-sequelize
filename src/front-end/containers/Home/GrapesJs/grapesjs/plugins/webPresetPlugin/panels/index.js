import {
  cmdImport,
  cmdDeviceDesktop,
  cmdDeviceTablet,
  cmdDeviceMobile,
  cmdClear,
} from '../consts';

export default (editor, config) => {
  const pn = editor.Panels;
  const eConfig = editor.getConfig();
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

  eConfig.showDevices = 0;

  pn.getPanels().reset([{
    id: 'commands',
    buttons: [{}],
  },
  {
    id: 'options',
    buttons: [{
      id: swv,
      command: swv,
      context: swv,
      className: 'fa fa-square-o',
    },
    {
      id: prv,
      context: prv,
      command: e => e.runCommand(prv),
      className: 'fa fa-eye',
    },
    {
      id: ful,
      command: ful,
      context: ful,
      className: 'fa fa-arrows-alt',
    },
    // {
    //   id: expt,
    //   className: 'fa fa-code',
    //   command: e => e.runCommand(expt),
    // },
    {
      id: 'undo',
      className: 'fa fa-undo',
      command: e => e.runCommand('core:undo'),
    },
    {
      id: 'redo',
      className: 'fa fa-repeat',
      command: e => e.runCommand('core:redo'),
    },
    // {
    //   id: cmdImport,
    //   className: 'fa fa-download',
    //   command: e => e.runCommand(cmdImport),
    // },
    {
      id: cmdClear,
      className: 'fa fa-trash',
      command: e => e.runCommand(cmdClear),
    }],
  },
  {
    id: 'views',
    buttons: [{
      id: osm,
      command: osm,
      active: true,
      className: 'fa fa-paint-brush',
    },
    // {
    //   id: otm,
    //   command: otm,
    //   className: 'fa fa-cog',
    // },
    // {
    //   id: ola,
    //   command: ola,
    //   className: 'fa fa-bars',
    // },
    {
      id: obl,
      command: obl,
      className: 'fa fa-th-large',
    }],
  }]);

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

  // Add devices buttons
  const panelDevices = pn.addPanel({ id: 'devices-c' });
  panelDevices.get('buttons').add([{
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

  const openBl = pn.getButton('views', obl);
  const swvBtn = pn.getButton('options', swv);
  editor.on('load', () => {
    openBl && openBl.set('active', 1);
    swvBtn && swvBtn.set('active', 1);
  });

  // On component change show the Style Manager
  config.showStylesOnChange && editor.on('component:selected', () => {
    const openSmBtn = pn.getButton('views', osm);
    const openLayersBtn = pn.getButton('views', ola);

    // Don't switch when the Layer Manager is on or
    // there is no selected component
    if ((!openLayersBtn || !openLayersBtn.get('active')) && editor.getSelected()) {
      openSmBtn && openSmBtn.set('active', 1);
    }
  });
};
