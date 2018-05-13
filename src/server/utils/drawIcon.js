import crypto from 'crypto';
import { PNG } from 'pngjs';

const setPixel = (png, x, y, color) => {
  const startPos = (png.width * y + x) << 2;
  color.map((c, i) => {
    png.data[startPos + i] = c;
  });
}

const drawLine = (png, strokeOffset, strokeWidth, color, axis = 0 /* 0: 'x', 1: 'y' */) => {
  const size = png.width;
  const widthFactor = size / 16;
  const draw = axis ? ((p, w) => setPixel(png, w, p, color)) : ((p, w) => setPixel(png, p, w, color));
  const strokeStartOffset = strokeOffset * widthFactor;
  const strokeFinishOffset = (strokeOffset + strokeWidth) * widthFactor;
  for (let i = 0; i < size; i++) {
    for (let j = strokeStartOffset; j < strokeFinishOffset; j++) {
      draw(i, j);
    }
  }
}

const getColor = (hash, offset) => {
  return [hash[offset + 0], hash[offset + 1], hash[offset + 2], 255];
}

const pattern1 = (png, hash) => {
  // for (let i = 0; i < png.width; i++) {
  //   for (let j = 0; j < png.height; j++) {
  //     setPixel(png, i, j, [255, 255, 255, 255]);
  //   }
  // }
  for (let i = 0; i < 8; i++) {
    const offset = i * 4;
    const cgbByte = hash[offset + 3];
    const strokeOffset = (cgbByte & 0x07) * 2;
    const axis = (cgbByte & 0x1f) >> 4;
    drawLine(png, strokeOffset, 2, getColor(hash, offset), axis);
  }
}


const pattern2 = (png, hash1) => {
  const hash2 = crypto.createHash('sha256')
  .update(new Date().getTime().toString()).digest();

  const lines = [];
  for (let i = 0; i < 8; i++) {
    const offset = i * 4;
    const cgbByte = hash1[offset + 3];
    lines.push({
      strokeOffset: i,
      color: getColor(hash1, offset),
      axis: 0,
      depth: cgbByte,
    });
  }

  for (let i = 0; i < 8; i++) {
    const offset = i * 4;
    const cgbByte = hash2[offset + 3];
    lines.push({
      strokeOffset: i,
      color: getColor(hash2, offset),
      axis: 1,
      depth: cgbByte,
    });
  }

  lines.sort((a, b) => (a.depth - b.depth)).map(l => {
    drawLine(png, l.strokeOffset * 2, 2, l.color, l.axis);
  });
}

export default (seed) => {
  const iconSize = 128;

  const hash = crypto.createHash('sha256')
  .update(seed).digest();
  let png = new PNG({
    width: iconSize,
    height: iconSize,
  });

  pattern1(png, hash);

  const options = { colorType: 6 };
  const buffer = PNG.sync.write(png, options);
  return buffer;
}
