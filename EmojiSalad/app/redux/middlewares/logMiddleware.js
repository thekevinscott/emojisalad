export default function logMiddleware() {
  return next => action => {
    //console.log(action);
    return next(action);
  };
}

