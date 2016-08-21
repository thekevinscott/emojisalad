const RouteException = (type, message, meta) => {
  this.data = {
    message,
  };
  this.type = type;
  this.meta = meta;
};

export default RouteException;
