import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import StartPage from './StartPage';
import PlayerHub from './PlayerHub';
import Scoreboard from './Scoreboard';

const history = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={history}>
    <div>
      <Route exact path="/" component={StartPage} />
      <Route exact path="/scoreboard" component={Scoreboard} />
      <Route exact path="/player-hub" component={PlayerHub} />
    </div>
  </Router>
);
