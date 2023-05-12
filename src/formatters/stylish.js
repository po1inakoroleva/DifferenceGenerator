import _ from 'lodash';

const spacesCount = 4;
const leftShift = 2;

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indentSize = spacesCount * depth;
  const currentIndent = ' '.repeat(indentSize);
  const bracketIndent = ' '.repeat(indentSize - spacesCount);
  const lines = Object.entries(value).map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 1)}`);

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

const stylish = (value, replacer = ' ') => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }
    const indentSize = spacesCount * depth - leftShift;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(spacesCount * depth - spacesCount);
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
