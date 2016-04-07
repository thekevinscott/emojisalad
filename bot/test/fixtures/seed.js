module.exports = [
  {
    table: 'attributes',
    rows: [
      { key: 'timestamp', value: (new Date()).getTime() / 1000 }
    ]
  },
  {
    table: 'protocols',
    rows: [
      { name: 'testqueue' }
    ]
  }
];
