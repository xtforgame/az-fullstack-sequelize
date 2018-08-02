// https://taylorpetrick.com/blog/post/https-nodejs-letsencrypt

import path from 'path';
import fs from 'fs';
import {
  jwtSecretFiles,
} from 'config';

const {
  basePath,
  private: privateFilename,
  public: publicFilename,
} = jwtSecretFiles;

export default {
  private: privateFilename && fs.readFileSync(path.join(basePath, privateFilename), 'utf8'),
  public: publicFilename && fs.readFileSync(path.join(basePath, publicFilename), 'utf8'),
};
