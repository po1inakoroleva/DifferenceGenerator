import fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const expectedStylish = readFile('expected_stylish.txt');
const expectedPlain = readFile('expected_plain.txt');
const expectedJSON = readFile('expected_json.txt');

const extensions = ['json', 'yml'];

test.each(extensions)('run genDiff', (extension) => {
  const fileBefore = getFixturePath(`file1.${extension}`);
  const fileAfter = getFixturePath(`file2.${extension}`);
  expect(genDiff(fileBefore, fileAfter)).toEqual(expectedStylish);
  expect(genDiff(fileBefore, fileAfter, 'stylish')).toEqual(expectedStylish);
  expect(genDiff(fileBefore, fileAfter, 'plain')).toEqual(expectedPlain);
  expect(genDiff(fileBefore, fileAfter, 'json')).toEqual(expectedJSON);
});
