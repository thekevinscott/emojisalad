/* globals Promise */
const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

const graphRequest = (path, unknownArg) => {
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(path, unknownArg, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    new GraphRequestManager().addRequest(infoRequest).start();
  });
};

export default graphRequest;
