import apn from 'apn';
import attachFeedback from './attachFeedback';

const CERTIFICATE_ROOT = 'utils/pushNotification/certificates/';

const getOptions = params => {
  return {
    batchFeedback: true,
    interval: 200,
    cert: `${CERTIFICATE_ROOT}development_cert.pem`,
    key: `${CERTIFICATE_ROOT}development_key.pem`,
    ...params,
  };
};

export default function getConnection(params = {}) {
  const options = getOptions(params);
  attachFeedback(options);
  return new apn.Connection(options);
}
