import * as React from 'react';
import * as Router from 'react-router';
import { App } from './app';
import { Dashboard } from './dashboard';
import { NotFound } from './notfound';
import { Account } from './account';
import { Logout } from './account/logout';

var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var Link = Router.Link;
var Route = Router.Route;

import { auth } from './auth';

export const routes = (
  <Route handler={App} path="/">
    <Route name="login" handler={Account} />
    <Route name="logout" handler={Logout} />
    <Route handler={Dashboard} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
