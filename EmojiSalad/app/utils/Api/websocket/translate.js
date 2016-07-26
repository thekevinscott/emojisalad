import TYPES from './schema';

const API_TYPES = Object.keys(TYPES).reduce((obj, key) => {
  const val = TYPES[key];
  return Object.assign({}, obj, {
    [val]: key,
  });
}, {});

export const toType = (type) => {
  return API_TYPES[type] || type;
};

export const getType = (type) => {
  return TYPES[type] || type;
};
