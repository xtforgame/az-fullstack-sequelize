import axios from 'axios';
import pathLib from 'path';
import { promiseReduce } from 'common/utils';
import createFragmentFile from '../grapesjs/utils/createFragmentFile';
import MinioFolderApi from '../../../../utils/MinioFolderApi';

export default class MinioFolderApiEx extends MinioFolderApi {
  constructor(pType = 'p', pId = '1', category = 'assets') {
    super(pType, pId, category);
  }

  getFileListEx = () => this.getFileList([]);

  saveComponentList = async (list = []) => {
    if (this.category !== 'np-components') {
      return null;
    }
    const filepath = 'list.json';
    const filename = pathLib.basename(filepath);
    const formData = new FormData();
    const json = JSON.stringify(list);
    formData.append('file', new Blob([json], { type: 'text/plain' }), filename);
    formData.append('filename', filepath);
    return this.saveFile(formData);
  }

  loadComponentList = async () => {
    const filepath = 'list.json';
    let list = [];
    try {
      ({ data: list } = await this.loadFile(filepath));
      if (!Array.isArray(list)) {
        throw new Error();
      }
      return list;
    } catch (error) {
      await this.saveComponentList();
      ({ data: list } = await this.loadFile(filepath));
      return list;
    }
  }

  saveFile = async formData => axios({
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    url: `api/${this.pType}/files/${this.folderRoot}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });

  saveAssetFile = async (e) => {
    if (this.category !== 'np-assets') {
      return [];
    }
    // Ref: https://blog.webnersolutions.com/adding-image-upload-feature-in-grapesjs-editor/
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    console.log('files :', files);

    return promiseReduce([...files], async (a, f) => {
      const formData = new FormData();
      console.log('f :', f);
      formData.append('file', f, f.name);
      // formData.append('filename', 'default');
      try {
        const { data } = await this.saveFile(formData);
        return [...a, data];
      } catch (error) {
        return a;
      }
    }, []);
  }

  saveFragmentFile = async (filepath, grapesjsData = {}) => {
    if (this.category !== 'np-fragments') {
      return null;
    }
    const filename = pathLib.basename(filepath);
    const formData = new FormData();
    const json = JSON.stringify(createFragmentFile(filename, grapesjsData));
    formData.append('file', new Blob([json], { type: 'text/plain' }), filename);
    formData.append('filename', filepath);
    return this.saveFile(formData);
  }

  createFragmentFile = async (filepath, grapesjsData = {}) => this.saveFragmentFile(filepath, grapesjsData);

  loadFile = async filepath => axios({
    method: 'get',
    url: pathLib.join(`api/${this.pType}/files/${this.folderRoot}`, filepath),
  });
}
