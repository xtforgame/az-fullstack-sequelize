import React, {
  useState, useLayoutEffect, useEffect, useRef,
} from 'react';
import grapesjs from 'grapesjs';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import useEffectIgnoreFirstRun from 'azrmui/hooks/useEffectIgnoreFirstRun';
import { getHeaders } from 'azrmui/utils/HeaderManager';
import updateScript from 'raw-loader!./update-script';
import MinioFolderApiEx from '../ui/MinioFolderApiEx';
import FilePicker from '../ui/FilePicker';
import FileSaver from '../ui/FileSaver';
import { defaultCss, defaultHtml } from './default-view';

// import 'grapesjs-blocks-basic';
import '../grapesjs/plugins/azGlobalScriptPlugin';
import '../grapesjs/plugins/azCommonPlugin';
import '../grapesjs/plugins/createCustomBlockPlugin';
// import 'grapesjs-preset-webpage';
import '../grapesjs/plugins/webPresetPlugin';
import '../grapesjs/plugins/assetManagerPlugin';
import { ProviderBase } from '../grapesjs/plugins/simpleStoragePlugin';
import '../grapesjs/plugins/editCodePlugin';
import '../grapesjs/plugins/azComponentsPlugin';
import '../grapesjs/plugins/azReplacedComponentsPlugin';
import '../grapesjs/plugins/customCodePlugin';
import '../grapesjs/plugins/imgConatinerPlugin';
import azFinalizePlugin from '../grapesjs/plugins/azFinalizePlugin';
import EventsBinder from './EventsBinder';
import ComponentEditor from './ComponentEditor';
import fixedCustomComponents from './fixedCustomComponents';
import LocalStorageProvider from '../grapesjs/plugins/simpleStoragePlugin/LocalStorageProvider';

const drawerWidth = 250;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    zIndex: 1199,
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#2c303b',
  },
  drawerPaperClose: {
    position: 'relative',
    width: 48,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#2c303b',
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'scroll',
  },
  drawerInnerMain: {
    // Make the items inside not wrap when transitioning:
    flex: 1,
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // padding: '0 8px',
    // ...theme.mixins.toolbar,
  },
  drawerHeaderClose: {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // padding: '0 8px',
    // ...theme.mixins.toolbar,
  },
  drawerSwitch: {
    position: 'absolute',
    left: drawerWidth - 48,
    color: 'white',
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerSwitchClose: {
    position: 'absolute',
    left: 0,
    color: 'white',
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarPlaceHolder: {
    minHeight: 48,
    backgroundColor: '#2c303b',
  },
  displayNone: {
    display: 'none',
  },
}));

export class MinioStorageProvider extends ProviderBase {
  constructor(fragmentMinioApi, fPath) {
    super();
    this.fragmentMinioApi = fragmentMinioApi;
    this.fPath = fPath;
    this.localStorageProvider = new LocalStorageProvider();
  }

  init(editor, options = {}) {
    this.editor = editor;
    this.editor.localState = this.editor.localState || {};
    this.editor.localState.saveToCloud = false;
    this.editor.localState.loadFromCloud = true;
    this.localStorageProvider.init(editor, options);
  }

  load(keys, clb, clbErr) {
    const storageManager = this.editor.StorageManager;
    const cb = (...args) => {
      // setTimeout(() => {
      //   storageManager.setAutosave(true);
      // }, 3000);
      clb(...args);
    };
    const cbE = (...args) => {
      // setTimeout(() => {
      //   storageManager.setAutosave(true);
      // }, 3000);
      clbErr(...args);
    };
    storageManager.setAutosave(false);
    if (!this.editor.localState.loadFromCloud) {
      console.log('load');
      this.editor.localState.loadFromCloud = true;
      this.localStorageProvider.load(keys, cb, cbE);
    } else {
      this.fragmentMinioApi.loadFile(this.fPath)
      .then(({ data: { grapesjsData } }) => {
        cb(grapesjsData);
      })
      .catch(e => cbE(e));
    }
  }

  store(data, clb, clbErr) {
    let cb = clb;
    if (this.editor.localState.saveToCloud) {
      this.editor.localState.saveToCloud = false;
      console.log('data :', data);
      cb = () => {
        this.fragmentMinioApi.saveFragmentFile(this.fPath, data)
        .then(({ data }) => {
          clb();
        })
        .catch(e => clbErr(e));
      };
    }
    console.log('store');
    this.localStorageProvider.store(data, cb, clbErr);
  }
}

const GrapesJsEditor = (props) => {
  const {
    css = defaultCss,
    html = defaultHtml,
    id = 'gjs',
    match,
  } = props;

  const {
    pType,
    pId,
  } = match.params;
  const fPath = match.params[0];

  const [open, setOpen] = useState(true);

  const fragmentMinioApiRef = useRef(new MinioFolderApiEx(pType, pId, 'np-fragments'));
  const fragmentMinioApi = fragmentMinioApiRef.current;

  const assetMinioApiRef = useRef(new MinioFolderApiEx(pType, pId, 'np-assets'));
  const assetMinioApi = assetMinioApiRef.current;

  const componentMinioApiRef = useRef(new MinioFolderApiEx(pType, pId, 'np-components'));
  const componentMinioApi = componentMinioApiRef.current;
  const [customCompnents, setCustomCompnents] = useState([]);

  const storageProviderRef = useRef(new MinioStorageProvider(fragmentMinioApiRef.current, fPath));
  const storageProvider = storageProviderRef.current;


  const classes = useStyles();
  const editorRef = useRef(null);
  const editorLoadedRef = useRef(false);

  const [dialogState, setDialogState] = useState(null);
  const [dialogValue, setDialogValue] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [editingComponent, setEditingComponent] = useState(null);


  const [{
    exited,
    dialogProps,
  }, {
    handleOpen,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    dialogProps: {},
    open: (v) => {
      console.log('v :', v);
    },
    close: (v2) => {
      console.log('v2 :', v2);
    },
  });

  const [{
    exited: eventsBinderExited,
    dialogProps: eventsBinderDialogProps,
  }, {
    handleOpen: eventsBinderHandleOpen_,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    dialogProps: {},
    open: (v) => {
      console.log('eventsBinder v :', v);
      setEditingData(v);
    },
    close: (v2) => {
      console.log('v2 :', v2);
      setEditingData(null);
    },
  });

  const eventsBinderHandleOpen = (data) => {
    setEditingData(data);
    eventsBinderHandleOpen_(data);
  };


  const [{
    exited: componentEditorExited,
    dialogProps: componentEditorDialogProps,
  }, {
    handleOpen: componentEditorHandleOpen_,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    dialogProps: {},
    open: (v) => {
      console.log('componentEditor v :', v);
      setEditingComponent(v);
    },
    close: (v2) => {
      console.log('v2 :', v2);
      setEditingComponent(null);
    },
  });

  const componentEditorHandleOpen = (data) => {
    setEditingData(data);
    componentEditorHandleOpen_(data);
  };

  useLayoutEffect(() => {
    const editor = grapesjs.init({
      height: '100%',
      forceClass: true,
      allowScripts: 1, // will remove by some-hack scripts
      showOffsets: 1,
      multipleSelection: false,
      noticeOnUnload: 0,
      storageManager: {
        type: 'simple-storage',
        autoload: false,
        autosave: false,
        stepsBeforeSave: 1,
      },
      // https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js
      styleManager: { clearProperties: 1 },
      container: `#${id}`,
      fromElement: true,

      canvas: {
        scripts: [
          // 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
          // 'grapesjs/canvi-master/canvi.js',
          // { type: 'module', 'data-stencil': '', 'data-resources-url': '/build/', 'data-stencil-namespace': 'xbase' },
          { type: 'module', src: 'https://rick.cloud/chatbotmate/assets/xbase/xbase.esm.js' },
          // { nomodule: '', src: 'https://rick.cloud/chatbotmate/assets/xbase/xbase.js', 'data-stencil': '' },
          'https://rick.cloud/chatbotmate/assets/xbase/xbase.init.js',
        ],
        styles: [
          'css/grapesjs-canvas.css',
          'css/style.css',
          // 'grapesjs/canvi-master/canvi.css',
          'https://rick.cloud/chatbotmate/assets/xbase/xbase.css',
        ],
      },
      panels: { defaults: [] },

      // selectorManager: {
      //   componentFirst: 1,
      // },
      assetManager: {
        // embedAsBase64: false,
        multiUpload: true, // Allow uploading multiple files per request. If disabled filename will not have '[]' appended
        showUrlInput: true, // Toggles visiblity of assets url input
        uploadFile(e) {
          assetMinioApi.saveAssetFile(e)
          .then((list) => {
            list.forEach((asset) => {
              editor.AssetManager.add([
                asset.file.url,
              ]);
              editor.AssetManager.render();
              console.log('asset :', asset);
            });
          });
        },
        assets: [
          {
            // You can pass any custom property you want
            category: 'c1',
            src: 'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
          }, {
            category: 'c1',
            src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg',
          }, {
            category: 'c2',
            src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
          },
        ],
      },
      layerManager: {
        appendTo: '.layers-container',
        extend: {
          setName(name) {
            console.log('name :', name);
            this.model.set('name', name);
            const attrs = this.model.getAttributes();
            attrs['data-gjs-name'] = name;
            this.model.setAttributes(attrs);
            // // this.model is the component of the layer
            // this.model.set('another-prop-for-name', name);
          },
        },
      },
      plugins: [
        'az-global-script',
        'az-common',
        'az-create-custom-block',
        'gjs-preset-webpage',
        'az-asset-manager',
        'az-edit-code',
        'az-simple-storage',
        'az-components',
        'az-replaced-components',
        'custom-code-p',
        'img-container',
        // 'az-finalize',
      ],
      pluginsOpts: {
        'az-global-script': {
          runOnceScript: 'window.azgjsRunOnce(\'azgjs-test\', () => { console.log(\'custom runOnceScript\'); });',
          updateScript,
          openEventsBinder: eventsBinderHandleOpen,
        },
        'az-common': {
          withCategory: true,
        },
        'az-create-custom-block': {
          manager: {
            onSave: async ({
              componentName,
              html,
              htmlCodeViewer,
              css,
              cssCodeViewer,
              editor,
              exCfg,
            }) => {
              const list = fixedCustomComponents || await componentMinioApi.loadComponentList();
              const newComponent = {
                name: componentName,
                version: '1.0.0',
                grapesjsData: {
                  ...exCfg,
                  label: componentName,
                  content: `${html}<style>${css}</style>`,
                },
                data: {
                  componentName, html, css, exCfg,
                },
              };
              let newList = [...list, newComponent];
              const currentCompnentIndex = list.findIndex(c => c.name === componentName);
              if (currentCompnentIndex !== -1) {
                const overwrite = confirm('發現重複名稱，要複寫嗎？');
                if (!overwrite) {
                  return Promise.reject(new Error('Do not overwrite'));
                }
                newList = [...list];
                newList.splice(currentCompnentIndex, 1, newComponent);
              }
              fixedCustomComponents || await componentMinioApi.saveComponentList(newList);
              setCustomCompnents(newList);
              // bm.render();
              // editor.DomComponents.getWrapper().set('content', '');
              // editor.setComponents(html.trim());
              // editor.setStyle(css);
            },
          },
        },
        'gjs-preset-webpage': {
          // blocksBasicOpts: { blocks: [] },
          formsOpts: { blocks: [] },
          // showStylesOnChange: 0,
        },
        'az-asset-manager': {},
        'az-simple-storage': {
          provider: storageProvider,
        },
        'az-edit-code': {
          // cssOnly: true,
        },
        'az-components': {},
        // 'az-finalize': {},
      },
    });

    editorRef.current = editor;

    componentMinioApi.loadComponentList()
    .then((list) => {
      // setCustomCompnents(list);
      setCustomCompnents(fixedCustomComponents || list);
    })
    .catch((e) => {});
    fragmentMinioApi.loadFile(fPath)
    .then(({ data }) => {
      // console.log('data :', data);
      if (!data.grapesjsData || !data.grapesjsData['gjs-components']) {
        editor.setComponents(html);
        editor.setStyle(css);
      } else {
        const storageManager = editor.StorageManager;
        storageManager.setAutosave(false);
        editor.load((res) => {
          // console.log('res :', res);
          console.log('Load callback');
        });
      }
    })
    .catch((e) => {});

    editor.on('load', () => {
      editorLoadedRef.current = true;
      azFinalizePlugin(editor, {});

      const { $ } = grapesjs;

      const pn = editor.Panels;
      // Load and show settings and style manager
      const openTmBtn = pn.getButton('views', 'open-tm');
      openTmBtn && openTmBtn.set('active', 1);
      const openSm = pn.getButton('views', 'open-sm');
      openSm && openSm.set('active', 1);

      // Add Settings Sector
      const traitsSector = $('<div class="gjs-sm-sector no-select">'
        + '<div class="gjs-sm-title"><span class="icon-settings fa fa-cog"></span> Settings</div>'
        + '<div class="gjs-sm-properties" style="display: none;"></div></div>');
      const traitsProps = traitsSector.find('.gjs-sm-properties');
      traitsProps.append($('.gjs-trt-traits'));
      $('.gjs-sm-sectors').before(traitsSector);
      traitsSector.find('.gjs-sm-title').on('click', () => {
        const traitStyle = traitsProps.get(0).style;
        const hidden = traitStyle.display == 'none';
        if (hidden) {
          traitStyle.display = 'block';
        } else {
          traitStyle.display = 'none';
        }
      });

      // Open block manager
      const openBlocksBtn = pn.getButton('views', 'open-blocks');
      openBlocksBtn && openBlocksBtn.set('active', 1);
      // setTimeout(() => {
      //   // Render new set of blocks
      //   const blockManager = editor.BlockManager;
      //   const blocks = blockManager.getAll();
      //   const filtered = blocks.filter(block => block.get('category').id === 'Basic');

      //   blockManager.render(filtered);
      // }, 3000);
      const x = $('.gjs-blocks-cs')[0];
      x.parentNode.insertBefore($(`<select id="block-set-selector" style="width: 100%;">
      <option value="All" selected>All</option>
      <option value="Basic,Extra">Basic</option>
    </select>`)[0], x);

      $('#block-set-selector').on('change', (e) => {
        // Render new set of blocks
        const setName = e.target.value;
        console.log('setName :', setName);
        const blockManager = editor.BlockManager;
        if (setName === 'All') {
          const blocks = blockManager.getAll();
          console.log('blocks :', blocks);
          blockManager.render();
        } else {
          const sets = setName.split(',').map(s => s.trim());
          const blocks = blockManager.getAll();
          const filtered = blocks.filter(block => sets.includes(block.get('category').id));
          blockManager.render(filtered);
        }
      });


      editor.on('update', (...args) => {
        const storageManager = editor.StorageManager;
        storageManager.setAutosave(true);
      });
    });

    // handleOpen(1);

    return () => {
      editor.DomComponents.clear(); // Clear components
      editor.CssComposer.clear(); // Clear styles
      editor.UndoManager.clear(); // Clear undo history
      // editor.destroy();
    };
  }, []);

  useEffectIgnoreFirstRun(() => {
    const run = () => {
      const bm = editorRef.current.BlockManager;
      customCompnents.forEach((c) => {
        bm.remove(c.name);
        bm.add(c.name, {
          ...c.grapesjsData,
          render({ el, model, className, prefix: ppfx }) {
            const label = model.get('label');
            const media = model.get('media');
            el.innerHTML = `
              ${media ? `<div class="${className}__media">${media}</div>` : ''}
              <div class="${className}-label">${label}</div>
              <i class="${className}-custom__edit is-abs--b-r u-p--xs fa fa-pencil is-clickable is-anim"></i>
            `;
            const editButton = el.querySelector(`.${className}-custom__edit`);
            editButton.onclick = (e) => {
              componentEditorHandleOpen({
                ...c.data,
                fullJson: JSON.stringify(c, null, 2),
              });
            };
            return '';
          },
        });
      });
      bm.render();
    };
    if (!editorLoadedRef.current) {
      editorRef.current.on('load', run);
    } else {
      run();
    }
  }, [customCompnents]);

  const drawerRef = useRef();
  return (
    <React.Fragment>
      <div style={{ height: '100%', overflowY: 'hidden' }}>
        <div className="editor-row" style={{ height: '100%', overflowY: 'scroll' }}>
          <Drawer
            ref={drawerRef}
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
            onTransitionEnd={(e) => {
              if (e.target.parentElement === drawerRef.current) {
                console.log('onTransitionEnd');
                editorRef.current.refresh();
              }
            }}
          >
            <div className={classes.drawerInner}>
              <AppBar position="relative" color="default">
                <IconButton className={open ? classes.drawerSwitch : classes.drawerSwitchClose} onClick={() => setOpen(!open)}>
                  {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </AppBar>
              <div className={classes.appBarPlaceHolder} />
              <div className={classes.drawerInnerMain}>
                <Divider />
                <div className={clsx('panel-left', { [classes.displayNone]: !open })}>
                  <div className="layers-container" />
                </div>
              </div>
            </div>
          </Drawer>
          <div className="editor-canvas">
            <div id={id} style={{ height: '0px', overflow: 'hidden' }} />
          </div>
        </div>
      </div>
      {!exited && false && (
        <FilePicker
          filePicker
          folderPicker
          api={fragmentMinioApi}
          dialogProps={dialogProps}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}
      {!exited && (
        <FileSaver
          api={fragmentMinioApi}
          defaultFileName="save-data-1-10.js"
          dialogProps={dialogProps}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}
      {!eventsBinderExited && (
        <EventsBinder
          editingData={editingData}
          api={fragmentMinioApi}
          defaultFileName="save-data-1-10.js"
          dialogProps={eventsBinderDialogProps}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}

      {!componentEditorExited && (
        <ComponentEditor
          editingData={editingComponent}
          api={fragmentMinioApi}
          defaultFileName="save-data-1-10.js"
          dialogProps={componentEditorDialogProps}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}
    </React.Fragment>
  );
};

export default GrapesJsEditor;
