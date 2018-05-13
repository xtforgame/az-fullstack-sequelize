import { PromiseObservable } from "rxjs/observable/PromiseObservable";

// http://code.hootsuite.com/html5/
export function isUploadSupported() {
  if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
    return false;
  }
  return true;
};

export function isFileReaderSupported() {
  return window.File && window.FileReader && window.FormData;
};

const getThumbnailSizeRange = (image, thumbnailInfo) => {
  const range = {
    min: { width: 0, height: 0 },
    max: { width: Infinity, height: Infinity },
  };

  const aspectRatio = image.width / image.height;

  // max
  if(thumbnailInfo.maxWidth != null){
    range.max.width = Math.min(range.max.width, thumbnailInfo.maxWidth);
  }
  if(thumbnailInfo.maxHeight != null){
    range.max.height = Math.min(range.max.height, thumbnailInfo.maxHeight);
  }

  // min
  if(thumbnailInfo.minWidth != null){
    range.min.width = Math.max(range.min.width, thumbnailInfo.minWidth);
  }
  if(thumbnailInfo.minHeight != null){
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
  if(image.width < range.min.width){
    suggestSize = {
      width: range.min.width,
      height: range.min.height,
    };
    needResize = true;
  }
  if(image.width > range.max.width){
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
    let image = new Image();
    image.src = dataURL;

    image.onload = function () {
      const result = {
        thumbnail: dataURL,
        dataURL,
      };

      let width = image.width;
      let height = image.height;

      if (!thumbnailInfo) {
        return resolve(result);
      }

      const {
        maxWidth,
        maxHeight,
      } = thumbnailInfo;

      let {
        needResize,
        suggestSize,
      } = getThumbnailSizeRange(image, thumbnailInfo);

      if (!needResize) {
        return resolve(result);
      }

      let canvas = document.createElement('canvas');

      canvas.width = suggestSize.width;
      canvas.height = suggestSize.height;

      let context = canvas.getContext('2d');

      context.drawImage(this, 0, 0, suggestSize.width, suggestSize.height);

      result.thumbnail = canvas.toDataURL(fileType);
      resolve(result);
    };

    image.onerror = function () {
      reject('There was an error processing your file!');
    };
  });
}

export function readFile(file, {
  thumbnailInfo,
}) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = function () {
      // console.log('reader.result, file :', reader.result, file);
      processFile(reader.result, file.type, thumbnailInfo).then(resolve, reject);
    }

    reader.onerror = function () {
      reject('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
  });
}
