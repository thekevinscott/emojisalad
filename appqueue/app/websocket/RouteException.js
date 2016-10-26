const RouteException = (type, message, meta) => {
  console.error('setting a route exception', this);
  this.data = {
    message,
  };
  this.type = type;
  this.meta = meta;
};

RouteException.prototype = new Error();

export default RouteException;
