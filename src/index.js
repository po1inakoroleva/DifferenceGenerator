import fs from 'fs';
import path from 'path';
import makeAstTree from './makeAstTree.js';
import getParsedContent from './parsers.js';
import getFormat from './formatters/index.js';

const getValidPath = (filepath) => path.resolve(process.cwd(), filepath);
const getFileData = (filepath) => fs.readFileSync(getValidPath(filepath), 'utf8');
const getExtname = (filepath) => path.extname(filepath);

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = getParsedContent(getFileData(filepath1), getExtname(filepath1));
  const data2 = getParsedContent(getFileData(filepath2), getExtname(filepath2));
  const format = getFormat(formatName);
  return format(makeAstTree(data1, data2));
};

export default genDiff;
