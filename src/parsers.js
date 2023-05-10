import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

const getValidPath = (file) => path.resolve(process.cwd(), file);

export default (filePath, fileExt) => {
  if (fileExt === '.json') {
    return JSON.parse(fs.readFileSync(getValidPath(filePath), 'utf8'));
  }
  if (fileExt === '.yaml' || fileExt === '.yml') {
    return load(fs.readFileSync(getValidPath(filePath), 'utf8'));
  }
  return console.error('Unknown file format');
};
