const checker = ({
  check,
  success,
  failure,
}) => {
  let _interval;
  let _timeout;

  const checkFor = resolve => {
    if (check()) {
      clearTimeout(_timeout);
      clearInterval(_interval);
      return resolve(success());
    }
  };

  return new Promise((resolve, reject) => {
    _timeout = setTimeout(() => {
      clearTimeout(_timeout);
      clearInterval(_interval);
      reject(failure());
    }, 2000);

    _interval = setInterval(() => {
      checkFor(resolve);
    }, 100);
  });
};

export default checker;
