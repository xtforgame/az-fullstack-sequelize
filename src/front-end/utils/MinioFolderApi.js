import axios from 'axios';
import pathLib from 'path';

export default class MinioFolderApi {
  constructor(pType = 'p', pId = '1', category = 'assets') {
    this.pType = pType;
    this.pId = pId;
    this.category = category;
    this.folderRoot = pathLib.join(pId, category);
    this.caches = {};
    this.extraFolders = {};
  }

  getCache = (path) => {
    this.caches[path] = this.caches[path] || [];
    return this.caches[path];
  }

  setCache = (path, files = []) => {
    this.caches[path] = files;
  }

  getExtraFolder = (path) => {
    this.extraFolders[path] = this.extraFolders[path] || [];
    return this.extraFolders[path];
  }

  setExtraFolder = (path, files = []) => {
    this.extraFolders[path] = files;
  }

  canCreate = async ({
    filename,
    type,
    params: {
      options: {
        paths,
      },
    },
  }) => {
    if (!filename) {
      return 'Filename or folder name is empty!!';
    }
    const path = paths.join('/');
    const found = this.getCache(path).concat(this.getExtraFolder(path)).find(info => info.relPath === filename);
    if (found) {
      if (found.type === 'folder' && type === 'file') {
        return 'Folder with the same name exists!!';
      } else if (found.type === 'file' && type === 'folder') {
        return 'File with the same name exists!!';
      }
    }
    return null;
  }

  isFileExists = async ({
    filename,
    type,
    params: {
      options: {
        paths,
      },
    },
  }) => {
    const path = paths.join('/');
    const found = this.getCache(path).find(info => info.relPath === filename);
    if (found && found.type === 'file') {
      return true;
    }
    return false;
  }

  createFileOrFolder = async ({
    filename,
    params: {
      options: {
        paths,
      },
    },
  }) => {
    const path = paths.join('/');
    const found = this.getCache(path).concat(this.getExtraFolder(path)).find(info => info.relPath === filename);
    if (!found) {
      const extraFolder = this.getExtraFolder(path);
      extraFolder.push({
        name: filename,
        relPath: filename,
        type: 'folder',
      });
    }
  }

  getFileList = async (paths) => {
    const path = paths.join('/');
    let list = [];
    try {
      ({ data: list } = await axios({
        method: 'get',
        url: pathLib.join(`api/${this.pType}/file-list/${this.folderRoot}`, path),
      }));
    } catch (error) {}


    let folders = [];
    let files = [];
    list.forEach((f) => {
      if (!f.name) {
        if (f.prefix && f.prefix.substr(f.prefix.length - 1, 1) === '/') {
          f.prefix = f.prefix.substr(0, f.prefix.length - 1);
        }
        folders.push(f);
      } else {
        files.push(f);
      }
    });

    let extraFolder = this.getExtraFolder(path);

    folders = folders.map(f => ({
      name: f.prefix,
      relPath: f.prefix,
      type: 'folder',
    }));

    files = files.map(f => ({
      name: f.name,
      relPath: f.name,
      type: 'file',
    }));
    files.sort((a, b) => a.name.localeCompare(b.name));

    extraFolder = extraFolder.filter(f => !folders.find(f2 => f2.name === f.name));
    extraFolder = extraFolder.filter(f => !files.find(f2 => f2.name === f.name));

    this.setExtraFolder(path, extraFolder);
    folders = folders.concat(extraFolder);
    folders.sort((a, b) => a.name.localeCompare(b.name));

    const result = folders.concat(files);
    this.caches[path] = result;
    return result;
  }
}
