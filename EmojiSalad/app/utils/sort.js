const sort = (a, b) => {
  return a.timestamp - b.timestamp;
};

export const sortByNewestFirst = (a, b) => {
  return sort(a, b);
};

export const sortByOldestFirst = (a, b) => {
  return sort(b, a);
};
