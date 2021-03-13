import React, { useState, useLayoutEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import { getHeaders } from 'azrmui/utils/HeaderManager';
import './grapesjs/plugins/styleManagerPlugin';
import './grapesjs/plugins/assetManagerPlugin';
import './grapesjs/plugins/simpleStoragePlugin';
import './grapesjs/plugins/azCommonPlugin';
import './grapesjs/plugins/createCustomBlockPlugin';
import './grapesjs/plugins/editCodePlugin';

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

const GrapesJs = (props) => {
  const {
    css = defaultCss,
    html = defaultHtml,
    id = 'gjs',
    canSelect = true,
    viewOnly = false,
  } = props;
  const classes = useStyles();
  const editorRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [selectedKey, setSelectedKey] = useState(0);
  const selectedRef = useRef({
    selected,
    selectedKey,
  });

  selectedRef.current = {
    selected,
    selectedKey,
  };

  useLayoutEffect(() => {
    let editor = null;
    if (viewOnly) {
      editor = grapesjs.init({
        // Indicate where to init the editor. You can also pass an HTMLElement
        container: `#${id}`,
        allowScripts: 1,
        // Get the content for the canvas directly from the element
        // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
        fromElement: true,
        // Size of the editor
        height: '300px',
        width: 'auto',
        // Disable the storage manager for the moment
        storageManager: false,
        // Avoid any default panel
        panels: { defaults: [] },
      });
    } else {
      editor = grapesjs.init({
        height: '100%',
        forceClass: true,
        allowScripts: 1,
        showOffsets: 1,
        noticeOnUnload: 0,
        storageManager: { type: 'simple-storage', autoload: false, autosave: false },
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
            // Ref: https://blog.webnersolutions.com/adding-image-upload-feature-in-grapesjs-editor/
            const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
            const formData = new FormData();
            console.log('files, formData :', files, formData);
            const f = files[0];
            console.log('f :', f);
            formData.append('file', f, f.name);
            // formData.append('filename', 'default');
            return axios({
              maxBodyLength: Infinity,
              maxContentLength: Infinity,
              url: `api/p/files/1/assets`,
              method: 'post',
              headers: {
                ...getHeaders(),
                'Content-Type': 'multipart/form-data',
              },
              data: formData,
            })
            .then(({ data }) => {
              editor.AssetManager.add([
                data.file.url,
              ]);
              editor.AssetManager.render();
              console.log('data :', data);
            });
            // for (const i in files) {
            //   formData.append(`file-${i}`, files[i]); // Containing all the selected images from local
            // }
            // $.ajax({
            //   url: `${siteURL}uploadImage_base64`, // Save image as base64 encoded - Its a function
            //   // url: siteURL + 'uploadImage', // Upload image to AmazonS3 - Its a function
            //   type: 'POST',
            //   data: formData,
            //   contentType: false,
            //   crossDomain: true,
            //   dataType: 'json',
            //   mimeType: 'multipart/form-data',
            //   processData: false,
            //   success(result) {
            //     const myJSON = [];
            //     if ((typeof (result.data) !== 'undefined') && (result != 'null')) {
            //       $.each(result.data, (key, value) => {
            //         myJSON[key] = value;
            //       });
            //       console.log(myJSON);
            //       // while using base64 encode => 0: {name: "ipsumImage.png", type: "image", src: "data:image/png;base64,iVBORw0KGgAAVwA…AAAAAAAAAAAAAAAD4Pv4B6rBPej6tvioAAAAASUVORK5CYII=", height: 145, width: 348}
            //       // while using AmazonS3 => 0: {name: "logo_sigclub.png", type: "image", src: "https://amazonaws.com/assets/CONTENT/img/logo_sigclub.png", status: true, message: "Uploaded successfully", …}
            //       editor.AssetManager.add(myJSON); // adding images to asset manager of GrapesJS
            //     }
            //   },
            // });
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
          'az-simple-storage',
          'az-edit-code',
          'az-create-custom-block',
          'az-common',
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
          'az-simple-storage': {},
          'az-edit-code': {
            // cssOnly: true,
          },
          'az-create-custom-block': {},
          'az-common': {
            withCategory: true,
          },
        },
      });
    }

    editorRef.current = editor;

    editor.setComponents(html);
    editor.setStyle(css);

    const onSelected = (component) => {
      console.log('component :', component);
      let changed = false;
      if (component !== selectedRef.current.selected) {
        changed = true;
      }
      setSelected(component);
      if (changed) {
        setSelectedKey(selectedRef.current.selectedKey + 1);
      }
    };

    if (canSelect) {
      editor.on('component:selected', onSelected);
    }
    return () => {
      if (canSelect) {
        editor.off('component:selected', onSelected);
      }
      editor.DomComponents.clear(); // Clear components
      editor.CssComposer.clear(); // Clear styles
      editor.UndoManager.clear(); // Clear undo history
      // editor.destroy();
    };
  }, []);

  // if (canSelect) {
  //   console.log('selectedKey :', selectedKey);
  //   if (selected) {
  //     console.log('selected.toHTML({}) :', selected.toHTML({}));
  //   }
  // }

  return (
    <React.Fragment>
      <div className={clsx({ 'azgjs-view': viewOnly })} style={{ height: 700 }}>
        <div id={id} style={{ height: '0px', overflow: 'hidden' }}>
          {/* <div className="panel">
            <h1 className="welcome">Welcome to</h1>
            <div className="big-title">
              <svg className="logo" viewBox="0 0 100 100">
                <path d="M40 5l-12.9 7.4 -12.9 7.4c-1.4 0.8-2.7 2.3-3.7 3.9 -0.9 1.6-1.5 3.5-1.5 5.1v14.9 14.9c0 1.7 0.6 3.5 1.5 5.1 0.9 1.6 2.2 3.1 3.7 3.9l12.9 7.4 12.9 7.4c1.4 0.8 3.3 1.2 5.2 1.2 1.9 0 3.8-0.4 5.2-1.2l12.9-7.4 12.9-7.4c1.4-0.8 2.7-2.2 3.7-3.9 0.9-1.6 1.5-3.5 1.5-5.1v-14.9 -12.7c0-4.6-3.8-6-6.8-4.2l-28 16.2" />
              </svg>
              <span>GrapesJS</span>
            </div>
            <div className="description">
              This is a demo content from index.html. For the development, you shouldn't edit this file, instead you can
              copy and rename it to _index.html, on next server start the new file will be served, and it will be ignored by git.
            </div>
          </div> */}
          {/* <style dangerouslySetInnerHTML={{__html: css }} /> */}
        </div>
      </div>
      {/* {
        selected && (
          <GrapesJs
            viewOnly
            canSelect={false}
            key={selectedKey}
            id={`${id}-${selectedKey}-selected`}
            html={selected.toHTML({})}
            css={saveCss({}).run(editorRef.current, null, { target: selected })}
          />
        )
      } */}
    </React.Fragment>
  );
};

export default GrapesJs;
