const squel = require('squel').useFlavour('mysql');
const db = require('db');

export default function updateStatus(key, status) {
  const getStatus = squel
  .select()
  .field('id')
  .from('statuses')
  .where('status=?', status);

  console.log(getStatus.toString());
  return db.query(getStatus).then(statuses => {
    const statusId = statuses[0].id;

    const query = squel
    .update()
    .table('sent')
    .setFields({
      status: statusId,
    })
    .where('`key`=?', key);

    console.log('query', query.toString());
    return db.query(query);
  });
}
