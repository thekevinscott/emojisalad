import * as React from 'react';
import * as Router from 'react-router';
import { App } from './app';
import { Dashboard } from './dashboard';
import { NotFound } from './notfound';
import { Account } from './account';
import { Logout } from './account/logout';
import { Game, Games } from './games';
import { User, Users } from './users';
import { Messages } from './messages';
import { Phrases } from './phrases';
import { Log, Logs } from './logs';

const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const Link = Router.Link;
const Route = Router.Route;

import { auth } from './auth';

export const routes = (
  <Route handler={App} path="/">
    <Route name="login" handler={Account} />
    <Route name="logout" handler={Logout} />
    <Route handler={Dashboard} />
    <Route handler={Games} name="games" />
    <Route name="game" path="/games/:game_id" handler={Game}/>
    <Route handler={Users} name="users" />
    <Route name="user" path="/users/:user_id" handler={User}/>
    <Route handler={Messages} name="messages" />
    <Route handler={Phrases} name="phrases" />
    <Route handler={Logs} name="logs" />
    <Route name="log" path="/logs/:log" handler={Log}/>
    <NotFoundRoute handler={NotFound} />
  </Route>
);
