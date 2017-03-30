import TYPES from './schema';

const API_TYPES = Object.keys(TYPES).reduce((obj, key) => {
  const val = TYPES[key];
  return Object.assign({}, obj, {
    [val]: key,
  });
}, {});

export const fromApiToType = (type) => {
  return API_TYPES[type] || type;
};

export const fromTypeToApi = (type) => {
  return TYPES[type] || type;
};
