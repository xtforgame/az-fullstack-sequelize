import React, {
  useState, useLayoutEffect, useEffect, useRef,
} from 'react';
import grapesjs from 'grapesjs';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import useEffectIgnoreFirstRun from 'azrmui/hooks/useEffectIgnoreFirstRun';
import { getHeaders } from 'azrmui/utils/HeaderManager';
import MinioFolderApiEx from '../ui/MinioFolderApiEx';
import FilePicker from '../ui/FilePicker';
import FileSaver from '../ui/FileSaver';
import { defaultCss, defaultHtml } from './default-view';

import 'grapesjs-blocks-basic';
import '../grapesjs/plugins/azCommonPlugin';
import '../grapesjs/plugins/createCustomBlockPlugin';
import 'grapesjs-preset-webpage';
import '../grapesjs/plugins/styleManagerPlugin';
import '../grapesjs/plugins/assetManagerPlugin';
import { ProviderBase } from '../grapesjs/plugins/simpleStoragePlugin';
import '../grapesjs/plugins/editCodePlugin';
import '../grapesjs/plugins/azComponentsPlugin';
import azFinalizePlugin from '../grapesjs/plugins/azFinalizePlugin';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export class MinioStorageProvider extends ProviderBase {
  constructor(fragmentMinioApi, fPath) {
    super();
    this.fragmentMinioApi = fragmentMinioApi;
    this.fPath = fPath;
  }

  init(editor, options = {}) {

  }

  load(keys, clb, clbErr) {
    this.fragmentMinioApi.loadFile(this.fPath)
    .then(({ data: { grapesjsData } }) => {
      clb(grapesjsData);
    })
    .catch(e => clbErr(e));
  }

  store(data, clb, clbErr) {
    this.fragmentMinioApi.saveFragmentFile(this.fPath, data)
    .then(({ data }) => {
      clb();
    })
    .catch(e => clbErr(e));
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

  useLayoutEffect(() => {
    const editor = grapesjs.init({
      height: '100%',
      forceClass: true,
      allowScripts: 1,
      showOffsets: 1,
      noticeOnUnload: 0,
      storageManager: {
        type: 'simple-storage',
        autoload: false,
        autosave: false,
        stepsBeforeSave: 1,
      },
      // https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js
      styleManager: {},
      container: `#${id}`,
      fromElement: true,

      canvas: {
        scripts: [
          // 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
          'grapesjs/canvi-master/canvi.js',
          // { type: 'module', 'data-stencil': '', 'data-resources-url': '/build/', 'data-stencil-namespace': 'xbase' },
          { type: 'module', src: 'https://rick.cloud/chatbotmate/assets/xbase/xbase.esm.js' },
          // { nomodule: '', src: 'https://rick.cloud/chatbotmate/assets/xbase/xbase.js', 'data-stencil': '' },
        ],
        styles: [
          'css/grapesjs-canvas.css',
          'css/style.css',
          'grapesjs/canvi-master/canvi.css',
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

      plugins: [
        'az-common',
        'az-create-custom-block',
        'gjs-preset-webpage',
        'az-style-manager',
        'az-asset-manager',
        'az-edit-code',
        'az-simple-storage',
        'az-components',
        // 'az-finalize',
      ],
      pluginsOpts: {
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
              const list = await componentMinioApi.loadComponentList();
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
              await componentMinioApi.saveComponentList(newList);
              setCustomCompnents(newList);
              // bm.render();
              // editor.DomComponents.getWrapper().set('content', '');
              // editor.setComponents(html.trim());
              // editor.setStyle(css);
            },
          },
        },
        'gjs-preset-webpage': {
          blocks: [],
          // blocksBasicOpts: { blocks: [] },
          navbarOpts: { blocks: [] },
          countdownOpts: { blocks: [] },
          formsOpts: { blocks: [] },
          // customStyleManager: [
          //   {
          //     name: 'General',
          //     open: false,
          //     buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
          //   },
          // ],
        },
        'az-style-manager': {},
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
      setCustomCompnents(list);
    })
    .catch((e) => {});
    fragmentMinioApi.loadFile(fPath)
    .then(({ data }) => {
      // console.log('data :', data);
      if (!data.grapesjsData || !data.grapesjsData['gjs-components']) {
        editor.setComponents(html);
        editor.setStyle(css);
      } else {
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
        bm.add(c.name, c.grapesjsData);
      });
      bm.render();
    };
    if (!editorLoadedRef.current) {
      editorRef.current.on('load', run);
    } else {
      run();
    }
  }, [customCompnents]);

  return (
    <React.Fragment>
      <div style={{ height: '100%' }}>
        <div id={id} style={{ height: '0px', overflow: 'hidden' }} />
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
    </React.Fragment>
  );
};

export default GrapesJsEditor;
