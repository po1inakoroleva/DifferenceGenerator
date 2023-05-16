import fs from 'fs';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from '@jest/globals';
import getDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const expectedStylish = readFile('expect_stylish.txt');
const expectedPlain = readFile('expect_plain.txt');
const expectedJSON = readFile('expect_json.json');

test('getDiff default formatter', () => {
  expect(getDiff(getFixturePath('filepath1.json'), getFixturePath('filepath2.json'))).toEqual(expectedStylish);
  expect(getDiff(getFixturePath('filepath1.yml'), getFixturePath('filepath2.yml'))).toEqual(expectedStylish);
});

test('getDiff stylish', () => {
  expect(getDiff(getFixturePath('filepath1.json'), getFixturePath('filepath2.json'), 'stylish')).toEqual(expectedStylish);
  expect(getDiff(getFixturePath('filepath1.yml'), getFixturePath('filepath2.yml'), 'stylish')).toEqual(expectedStylish);
});

test('getDiff plain', () => {
  expect(getDiff(getFixturePath('filepath1.json'), getFixturePath('filepath2.json'), 'plain')).toEqual(expectedPlain);
  expect(getDiff(getFixturePath('filepath1.yml'), getFixturePath('filepath2.yml'), 'plain')).toEqual(expectedPlain);
});

test('getDiff json', () => {
  expect(getDiff(getFixturePath('filepath1.json'), getFixturePath('filepath2.json'), 'json')).toEqual(expectedJSON);
  expect(getDiff(getFixturePath('filepath1.yml'), getFixturePath('filepath2.yml'), 'json')).toEqual(expectedJSON);
});
