import _ from 'lodash';

const getIndent = (depth, leftShift = 0, spacesCount = 4) => ' '.repeat(spacesCount * depth - leftShift);
const getBracketIndent = (depth, spacesCount = 4) => ' '.repeat(spacesCount * depth - spacesCount);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const currentIndent = getIndent(depth);
  const bracketIndent = getBracketIndent(depth);
  const lines = Object.entries(value).map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 1)}`);

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const stylish = (value) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const currentIndent = getIndent(depth, 2);
    const bracketIndent = getBracketIndent(depth);
    const lines = currentValue.flatMap((data) => {
      switch (data.type) {
        case 'added':
          return `${currentIndent}+ ${data.key}: ${stringify(data.value, depth + 1)}`;
        case 'deleted':
          return `${currentIndent}- ${data.key}: ${stringify(data.value, depth + 1)}`;
        case 'unchanged':
          return `${currentIndent}  ${data.key}: ${stringify(data.value, depth + 1)}`;
        case 'changed':
          return `${currentIndent}- ${data.key}: ${stringify(data.oldValue, depth + 1)}
${currentIndent}+ ${data.key}: ${stringify(data.newValue, depth + 1)}`;
        case 'nested':
          return `${currentIndent}  ${data.key}: ${iter(data.children, depth + 1)}`;
        default:
          return null;
      }
    });
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };
  return iter(value, 1);
};

export default stylish;
