import * as React from 'react';
import * as Router from 'react-router';
import { App } from './app';
import { Dashboard } from './dashboard';
import { NotFound } from './notfound';
import { Account } from './account';
import { Logout } from './account/logout';
import { Games } from './games';
import { Players } from './players';

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
    <Route handler={Games} name="games" />
    <Route handler={Players} name="players" />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
