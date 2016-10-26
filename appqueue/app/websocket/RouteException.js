export default class RouteException extends Error {
  constructor(type, message, meta) {
    super(message);
    //console.error('setting a route exception', this);
    this.data = {
      message,
    };
    this.type = type;
    this.meta = meta;
  }
}
