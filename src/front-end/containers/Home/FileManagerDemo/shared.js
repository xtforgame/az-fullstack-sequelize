import { promiseWait } from 'azrmui/common/utils';

const caches = {};
const createFileList = (prefix = '') => [
  {
    name: `${prefix}-1`,
    relPath: `${prefix}-1`,
    type: 'folder',
  },
  {
    name: `${prefix}-2`,
    relPath: `${prefix}-2`,
    type: 'folder',
  },
  {
    name: `${prefix}-3`,
    relPath: `${prefix}-3`,
    type: 'folder',
  },
  {
    name: `${prefix}-4.js`,
    relPath: `${prefix}-4.js`,
    type: 'file',
  },
  {
    name: `${prefix}-5.js`,
    relPath: `${prefix}-5.js`,
    type: 'file',
  },
  {
    name: `${prefix}-6.js`,
    relPath: `${prefix}-6.js`,
    type: 'file',
  },
  {
    name: `${prefix}-7.js`,
    relPath: `${prefix}-7.js`,
    type: 'file',
  },
  {
    name: `${prefix}-8.js`,
    relPath: `${prefix}-8.js`,
    type: 'file',
  },
  {
    name: `${prefix}-9.js`,
    relPath: `${prefix}-9.js`,
    type: 'file',
  },
  {
    name: `${prefix}-10.js`,
    relPath: `${prefix}-10.js`,
    type: 'file',
  },
];

export const canCreate = async ({
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
  caches[path] = caches[path] || createFileList();
  const found = caches[path].find(info => info.relPath === filename);
  if (found && found.type === 'folder') {
    return 'Folder with the same name exists!!';
  }
  return null;
};

export const isFileExists = async ({
  filename,
  type,
  params: {
    options: {
      paths,
    },
  },
}) => {
  const path = paths.join('/');
  caches[path] = caches[path] || createFileList();
  const found = caches[path].find(info => info.relPath === filename);
  if (found && found.type === 'file') {
    return true;
  }
  return false;
};

export const createFileOrFolder = async ({
  filename,
  params: {
    options: {
      paths,
    },
  },
}) => {
  const path = paths.join('/');
  caches[path] = caches[path] || createFileList();
  const found = caches[path].find(info => info.relPath === filename);
  if (!found) {
    caches[path].push({
      name: filename,
      relPath: filename,
      type: 'folder',
    });
  }
};

export const getFileList = async (paths) => {
  const path = paths.join('/');
  const prefix = paths.length ? paths[paths.length - 1] : 'save-data';
  caches[path] = caches[path] || createFileList(prefix);
  // console.log('prefix :', prefix);
  // await promiseWait(500);
  return caches[path];
};
