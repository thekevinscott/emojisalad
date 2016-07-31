import uuid from 'uuid';

//const salt = 'dd6F3Efed6F3d6F3Efeqd6F3Efd6F3Efd6F3Efeqd6F3Efe';

export default function getUUID() {
  return uuid.v1({
    //node: salt,
  });
}
