/* eslint-disable no-console, import/no-extraneous-dependencies */
import crypto from 'crypto';
import { Client } from 'minio';
import { promiseWait } from 'common/utils';
import { minioInfoConfig } from 'config';
import ServiceBase from '../ServiceBase';

const bucketName = minioInfoConfig.defaultBucketName;
// const defaultBotNameOnMinio = 'wasm-basic-001';

// Instantiate the minio client with the endpoint
// and access keys as shown below.
const minioClient = new Client(minioInfoConfig);

const ensureBucket = () => minioClient.listBuckets()
.then((buckets) => {
  if (!buckets.find(b => b.name === bucketName)) {
    return minioClient.makeBucket(bucketName, 'us-east-1')
    .then(() => {
      console.log('Bucket created successfully in "us-east-1".');
    });
  }
  return null;
});

const uploadProject = () => {
  // const metaData = {
  //   'Content-Type': 'application/octet-stream',
  //   'X-Amz-Meta-Testing': 1234,
  //   // example: 5678,
  // };

  // const buffer = Buffer.from('cooool', 'utf8');

  // return minioClient.putObject(bucketName, defaultBotNameOnMinio, buffer, metaData)
  // .then((etag) => {
  //   console.log('etag :', etag);
  //   return minioClient.statObject(bucketName, defaultBotNameOnMinio);
  // })
  // .then((stat) => {
  //   console.log('stat :', stat);
  //   return minioClient.getObject(bucketName, defaultBotNameOnMinio);
  // })
  // .then((dataStream) => {
  //   let size = 0;
  //   dataStream.on('data', (chunk) => {
  //     size += chunk.length;
  //   });
  //   dataStream.on('end', () => {
  //     console.log(`End. Total size = ${size}`);
  //   });
  //   dataStream.on('error', (err) => {
  //     console.log(err);
  //   });
  // });
};

const initProject = () => ensureBucket() // eslint-disable-line no-underscore-dangle
.then(() => uploadProject());

export default class MinioApi extends ServiceBase {
  static $name = 'minioApi';

  static $type = 'service';

  static $inject = ['envCfg'];

  static $runBefore = {
    start: ['httpApp'],
  };

  static $funcDeps = {
    destroy: ['httpApp'],
  };

  constructor(envCfg) {
    super();
    this.isReady = false;
  }

  async onStart() {
    let retryCounter = 0;
    const init = () => initProject()
    .then(() => { this.isReady = true; })
    .catch(async (e) => {
      retryCounter++;
      if (retryCounter > minioInfoConfig.retry) {
        if (!minioInfoConfig.ignoreInitFailure) {
          return Promise.reject(e);
        }
        console.log('minio init error :', e);
        return Promise.resolve();
      }
      console.log('minio retry :', retryCounter);
      await promiseWait(minioInfoConfig.retryInterval);
      return init();
    });
    // await init();
    // await this.listObjectsWithMetadata();
    return init();
  }

  onDestroy() {
  }

  async simpleSaveFile(filename, {
    creatorIp,
    userId,
    encoding,
    contentType,
    buffer,
    originalName,
  }) {
    const metaData = {
      'Content-Type': encodeURI(contentType),
      'X-Amz-Meta-Encoding': encodeURI(encoding),
      'X-Amz-Meta-Creator-ID': encodeURI(userId),
      'X-Amz-Meta-Creator-IP': encodeURI(creatorIp),
      'X-Amz-Meta-Original-Name': encodeURI(originalName),
      'X-Amz-Meta-Timestamp': new Date().getTime(),
      // 'X-Amz-Meta-Testing': 1234,
      // example: 5678,
    };

    const etag = minioClient.putObject(bucketName, filename, buffer, metaData);

    return {
      etag,
      filename,
    };
  }

  async saveFile(fileInfo) {
    const {
      buffer,
      metadata,
    } = fileInfo;

    const hash = crypto.createHash('sha256')
    .update(buffer, 'binary')
    .digest('hex');

    if (metadata) {
      await minioClient.putObject(bucketName, `${hash}.metadata`, metadata.buffer, {
        'Content-Type': 'application/json',
      });
    }

    const { etag, filename } = this.simpleSaveFile(hash, fileInfo);
    return {
      etag,
      hash: filename,
    };
  }

  async statFile(filename) {
    const { metaData = {}, etag } = await minioClient.statObject(bucketName, filename);
    const headers = {
      'Content-Type': metaData['content-type'],
      ETag: etag,
    };
    return {
      metaData,
      etag,
      headers,
    };
  }

  async getFile(filename) {
    const stat = await this.statFile(filename);
    const dataStream = await minioClient.getObject(bucketName, filename);
    return {
      ...stat,
      dataStream,
    };
  }

  async listObjects(objectPath = '', recursive = false) {
    return new Promise((res, rej) => {
      const stream = minioClient.listObjectsV2(bucketName, objectPath, recursive, '');
      const result = [];
      stream.on('data', (obj) => { result.push(obj); });
      stream.on('error', rej);
      stream.on('end', () => res(result));
    });
  }

  async listObjectsWithMetadata(objectPath = '', recursive = false) {
    return new Promise((res, rej) => {
      const stream = minioClient.extensions.listObjectsV2WithMetadata(bucketName, objectPath, recursive, '');
      const result = [];
      stream.on('data', (obj) => { result.push(obj); });
      stream.on('error', rej);
      stream.on('end', () => res(result));
    });
  }
}
