import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const plain = (diff) => {
  const iter = (data, path) => {
    const result = data
      .filter((node) => node.type !== 'unchanged')
      .map((node) => {
        const fullPath = path === '' ? `${node.key}` : `${path}.${node.key}`;

        switch (node.type) {
          case 'nested':
            return iter(node.children, fullPath);
          case 'added':
            return `Property '${fullPath}' was added with value: ${stringify(node.value)}`;
          case 'deleted':
            return `Property '${fullPath}' was removed`;
          case 'changed':
            return `Property '${fullPath}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.newValue)}`;
          case 'unchanged':
            return null;
          default:
            throw new Error(`Unknown type: '${node.type}'!`);
        }
      });

    return result.join('\r\n');
  };

  return iter(diff, '');
};

export default plain;
