const squel = require('squel').useFlavour('mysql');
import db from 'db';
//import crypto from 'crypto';
import uuid from 'node-uuid';
//const algorithm = 'aes-256-ctr';
//const password = 'dd6F3Efed6F3d6F3Efeqd6F3Efd6F3Efd6F3Efeqd6F3Efe';

//function encrypt(text) {
  //const payload = new Buffer(text + password).toString('base64');
  //const cipher = crypto.createCipher(algorithm,password);
  //let crypted = cipher.update(payload,'utf8','hex');
  //crypted += cipher.final('hex');
  //return crypted.substring(0, 32);
//}

export default function setKey(table, obj, where) {
  if (! table || typeof table !== 'string') {
    throw new Error('please provide a valid table in setKey');
  }
  if (! obj || typeof obj !== 'object') {
    throw new Error('please provide a valid obj in setKey');
  }
  const preHash = uuid.v4();
  //const preHash = encrypt(JSON.stringify(obj));
  let query = squel
  .update()
  .setFields({
    '`key`': preHash,
  })
  .table(table);

  if (where) {
    query = query.where(where);
  } else {
    query = query.where('id=?',obj.id);
  }

  //console.log(query.toString());
  return db.query(query).then(result => {
    //console.log('result', result);
    if (!result || !result.affectedRows) {
      console.info('set key collision, try again', preHash);
      return setKey(table, obj, where);
      //return setKey(table, {
        //salt: Math.random(),
        //...obj,
      //}, where);
    }
  });
}
