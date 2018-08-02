// http://code.hootsuite.com/html5/
export function isUploadSupported() {
  if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) { // eslint-disable-line max-len
    return false;
  }
  return true;
}

export function isFileReaderSupported() {
  return window.File && window.FileReader && window.FormData;
}

const getThumbnailSizeRange = (image, thumbnailInfo) => {
  const range = {
    min: { width: 0, height: 0 },
    max: { width: Infinity, height: Infinity },
  };

  const aspectRatio = image.width / image.height;

  // max
  if (thumbnailInfo.maxWidth != null) {
    range.max.width = Math.min(range.max.width, thumbnailInfo.maxWidth);
  }
  if (thumbnailInfo.maxHeight != null) {
    range.max.height = Math.min(range.max.height, thumbnailInfo.maxHeight);
  }

  // min
  if (thumbnailInfo.minWidth != null) {
    range.min.width = Math.max(range.min.width, thumbnailInfo.minWidth);
  }
  if (thumbnailInfo.minHeight != null) {
    range.min.height = Math.max(range.min.height, thumbnailInfo.minHeight);
  }

  range.max.width = Math.min(range.max.width, range.max.height * aspectRatio);
  range.max.height = Math.min(range.max.height, range.max.width / aspectRatio);

  range.min.width = Math.max(range.min.width, range.min.height * aspectRatio);
  range.min.height = Math.max(range.min.height, range.min.width / aspectRatio);

  let needResize = false;
  let suggestSize = {
    width: image.width,
    height: image.height,
  };
  if (image.width < range.min.width) {
    suggestSize = {
      width: range.min.width,
      height: range.min.height,
    };
    needResize = true;
  }
  if (image.width > range.max.width) {
    suggestSize = {
      width: range.max.width,
      height: range.max.height,
    };
    needResize = true;
  }
  return {
    range,
    needResize,
    suggestSize,
  };
};

export function processFile(dataURL, fileType, thumbnailInfo) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = dataURL;

    image.onload = () => {
      const result = {
        thumbnail: dataURL,
        dataURL,
      };

      // const {
      //   width,
      //   height,
      // } = image;

      if (!thumbnailInfo) {
        return resolve(result);
      }

      // const {
      //   maxWidth,
      //   maxHeight,
      // } = thumbnailInfo;

      const {
        needResize,
        suggestSize: {
          width,
          height,
        },
      } = getThumbnailSizeRange(image, thumbnailInfo);

      if (!needResize) {
        return resolve(result);
      }

      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');

      context.drawImage(this, 0, 0, width, height);

      result.thumbnail = canvas.toDataURL(fileType);
      return resolve(result);
    };

    image.onerror = () => {
      reject(new Error('There was an error processing your file!'));
    };
  });
}

export const readFile = (file, { thumbnailInfo }) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    // console.log('reader.result, file :', reader.result, file);
    processFile(reader.result, file.type, thumbnailInfo).then(resolve, reject);
  };

  reader.onerror = () => {
    reject(new Error('There was an error reading the file!'));
  };

  reader.readAsDataURL(file);
});
