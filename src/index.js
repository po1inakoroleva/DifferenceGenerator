import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const compare = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2)).sort();
  const result = [];
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (!_.has(data1, key)) {
      result.push({ key, value: data2[key], type: 'added' });
    } else if (!_.has(data2, key)) {
      result.push({ key, value: data1[key], type: 'deleted' });
    } else if (data1[key] !== data2[key]) {
      result.push({
        key,
        oldValue: data1[key],
        newValue: data2[key],
        type: 'changed',
      });
    } else {
      result.push({ key, value: data1[key], type: 'unchanged' });
    }
  }
  return result;
};

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue) && !_.isUndefined(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = spacesCount * depth;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const lines = currentValue.map((data) => {
      switch (data.type) {
        case 'added':
          return `${currentIndent}+ ${data.key}: ${iter(data.value, depth + 1)}`;
        case 'deleted':
          return `${currentIndent}- ${data.key}: ${iter(data.value, depth + 1)}`;
        case 'unchanged':
          return `${currentIndent}  ${data.key}: ${iter(data.value, depth + 1)}`;
        case 'changed':
          return `${currentIndent}- ${data.key}: ${iter(data.oldValue, depth + 1)}
${currentIndent}+ ${data.key}: ${iter(data.newValue, depth + 1)}`;
        default:
          return null;
      }
    });
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(value, 1);
};

const getObject = (filepath) => {
  const getValidPath = (file) => path.resolve(process.cwd(), file);
  const parse = JSON.parse(fs.readFileSync(getValidPath(filepath), 'utf-8'));
  return parse;
};

const genDiff = (filepath1, filepath2) => {
  const obj1 = getObject(filepath1);
  const obj2 = getObject(filepath2);
  const comparisonResult = compare(obj1, obj2);
  const result = stringify(comparisonResult);
  return result;
};

export default genDiff;