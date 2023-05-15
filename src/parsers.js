import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

const getValidPath = (filepath) => path.resolve(process.cwd(), filepath);
const getExtname = (filepath) => path.extname(filepath);

export default (filepath) => {
  const fileExt = getExtname(filepath);

  if (fileExt === '.json') {
    return JSON.parse(fs.readFileSync(getValidPath(filepath), 'utf8'));
  }
  if (fileExt === '.yaml' || fileExt === '.yml') {
    return load(fs.readFileSync(getValidPath(filepath), 'utf8'));
  }
  throw new Error(`Unknown format: '${fileExt}'!`);
};
