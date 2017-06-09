import routes from './routes';
import bodyParser from 'body-parser';
import pmx from 'pmx';

const defaultPOSTLimit = '35mb';

export default function bootstrapREST(app) {
  app.use(pmx.expressErrorHandler());
  // to support JSON-encoded bodies
  app.use(bodyParser.json({
    limit: defaultPOSTLimit,
  }));
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: defaultPOSTLimit,
    parameterLimit: 50000,
  }));

  //app.get('/senders', require('./rest/senders'));
  //app.get('/senders/:sender', require('./restsenders').getSenderID);
  routes(app);
}
