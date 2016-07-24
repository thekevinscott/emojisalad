module.exports = function(type) {
  const handleError = (message) => {
    console.log('error message', message);
    return new Error(JSON.stringify({
      type,
      message,
    }));
  };

  return handleError;
}
