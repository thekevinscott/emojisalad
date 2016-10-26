const RouteException = (type, message, meta) => {
  console.error('setting a route exception', this);
  this.data = {
    message,
  };
  this.type = type;
  this.meta = meta;
};

export default RouteException;
