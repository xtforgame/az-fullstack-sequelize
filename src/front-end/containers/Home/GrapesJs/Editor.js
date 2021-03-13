import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import { getHeaders } from 'azrmui/utils/HeaderManager';
import MinioFolderApiEx from './ui/MinioFolderApiEx';
import FilePicker from './ui/FilePicker';
import FileSaver from './ui/FileSaver';

import './grapesjs/plugins/styleManagerPlugin';
import './grapesjs/plugins/assetManagerPlugin';
import { ProviderBase } from './grapesjs/plugins/simpleStoragePlugin';
import './grapesjs/plugins/createCustomBlockPlugin';
import './grapesjs/plugins/editCodePlugin';
import './grapesjs/plugins/azCommonPlugin';
import './grapesjs/plugins/azComponentsPlugin';

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

const defaultCss = `
.panel {
  width: 90%;
  max-width: 700px;
  border-radius: 3px;
  padding: 30px 20px;
  margin: 150px auto 0px;
  background-color: #d983a6;
  box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
  color:rgba(255,255,255,0.75);
  font: caption;
  font-weight: 100;
}

@media (min-width: 768px) and (max-width: 979px) {
  .panel {
    max-width: 700px;
}
}

.welcome {
  text-align: center;
  font-weight: 100;
  margin: 0px;
}

.logo {
  width: 70px;
  height: 70px;
  vertical-align: middle;
}

.logo path {
  pointer-events: none;
  fill: none;
  stroke-linecap: round;
  stroke-width: 7;
  stroke: #fff
}

.big-title {
  text-align: center;
  font-size: 3.5rem;
  margin: 15px 0;
}

.description {
  text-align: justify;
  font-size: 1rem;
  line-height: 1.5rem;
}
`;

const defaultHtml = `
<div class="panel">
  <h1 class="welcome">Welcome to</h1>
  <div class="big-title">
    <svg class="logo" viewBox="0 0 100 100">
      <path d="M40 5l-12.9 7.4 -12.9 7.4c-1.4 0.8-2.7 2.3-3.7 3.9 -0.9 1.6-1.5 3.5-1.5 5.1v14.9 14.9c0 1.7 0.6 3.5 1.5 5.1 0.9 1.6 2.2 3.1 3.7 3.9l12.9 7.4 12.9 7.4c1.4 0.8 3.3 1.2 5.2 1.2 1.9 0 3.8-0.4 5.2-1.2l12.9-7.4 12.9-7.4c1.4-0.8 2.7-2.2 3.7-3.9 0.9-1.6 1.5-3.5 1.5-5.1v-14.9 -12.7c0-4.6-3.8-6-6.8-4.2l-28 16.2"/>
    </svg>
    <span>GrapesJS</span>
  </div>
  <!-- end social media -->
</div>
`;

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
        ],
        styles: [
          'css/grapesjs-canvas.css',
          'css/style.css',
        ],
      },
      panels: { defaults: [] },

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
        'gjs-preset-webpage',
        'az-style-manager',
        'az-asset-manager',
        'az-edit-code',
        'az-simple-storage',
        'az-create-custom-block',
        'az-common',
        'az-components',
      ],
      pluginsOpts: {
        'gjs-preset-webpage': {
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
                grapesjsData: {
                  ...exCfg,
                  label: componentName,
                  content: `${html}<style>${css}</style>`,
                },
                data: { componentName, html, css, exCfg },
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
        'az-common': {
          withCategory: true,
        },
        'az-components': {},
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
      console.log('data :', data);
      if (!data.grapesjsData || !data.grapesjsData['gjs-components']) {
        editor.setComponents(html);
        editor.setStyle(css);
      } else {
        editor.load((res) => {
          console.log('res :', res);
          console.log('Load callback');
        });
      }
    })
    .catch((e) => {});


    // handleOpen(1);

    return () => {
      editor.DomComponents.clear(); // Clear components
      editor.CssComposer.clear(); // Clear styles
      editor.UndoManager.clear(); // Clear undo history
      // editor.destroy();
    };
  }, []);

  useEffect(() => {
    const bm = editorRef.current.BlockManager;
    customCompnents.forEach((c) => {
      bm.remove(c.name);
      bm.add(c.name, c.grapesjsData);
    });
    bm.render();
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
