import * as React from 'react';
import * as Router from 'react-router';
import { App } from './app';
import { Dashboard } from './dashboard';
import { NotFound } from './notfound';
import { Account } from './account';
import { Logout } from './account/logout';
import { Games } from './games';
import { Game } from './games';
import { Players } from './players';
import { Messages } from './messages';

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
    <Route name="game" path="/games/:game_id" handler={Game}/>
    <Route handler={Players} name="players" />
    <Route handler={Messages} name="messages" />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
