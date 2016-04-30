module.exports = [
  {
    table: 'attributes',
    rows: [
      { key: 'timestamp', value: (new Date()).getTime() / 1000 },
      { key: 'foo', value: 'bar' }
    ]
  }
];
