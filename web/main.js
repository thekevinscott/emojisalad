import * as React from 'react';
import * as Router from 'react-router';
import { routes } from './routes';
import { RouterContainer } from './router';

RouterContainer.set(Router.run(routes, Router.HashLocation, (Handler) => {
  React.render(<Handler />, document.body);
}));
