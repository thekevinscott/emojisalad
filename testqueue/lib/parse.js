module.exports = function parse(params) {
  return {
    body: params.body || params.Body,
    to: params.to || params.To,
    from: params.from || params.From,
    data: JSON.stringify(params)
  }
}
