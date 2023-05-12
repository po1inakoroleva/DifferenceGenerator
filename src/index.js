import _ from 'lodash';
import parse from './parsers.js';
import stylish from './formatters/stylish.js';

const genDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(_.keys(data1), _.keys(data2)));

  const result = keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.isObject(value1) && _.isObject(value2)) {
      return { key, children: genDiff(value1, value2), type: 'nested' };
    }
    if (!_.has(data1, key)) {
      return { key, value: value2, type: 'added' };
    }
    if (!_.has(data2, key)) {
      return { key, value: value1, type: 'deleted' };
    }
    if (value1 !== value2) {
      return {
        key,
        oldValue: data1[key],
        newValue: data2[key],
        type: 'changed',
      };
    }
    if (value1 === value2) {
      return { key, value: data1[key], type: 'unchanged' };
    }
  });

  return result;
};

const getDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  if (formatName === 'stylish') {
    return stylish(genDiff(data1, data2));
  }
  return null;
};

export default getDiff;
