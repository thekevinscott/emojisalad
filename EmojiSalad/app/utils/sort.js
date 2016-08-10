const sort = (a, b) => {
  return a - b;
};

const getArgs = (direction, args) => {
  if (direction === 'newestFirst' || direction === 'newest') {
    return {
      a: args[0],
      b: args[1],
    };
  }

  return {
    a: args[1],
    b: args[0],
  };
};

export const sortBy = (direction, transform) => {
  return (...args) => {
    const {
      a,
      b,
    } = getArgs(direction, args);
    return sort(transform(a), transform(b));
  };
};
