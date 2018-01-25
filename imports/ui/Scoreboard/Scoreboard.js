import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { hasGameStarted } from '../../api/games';

class Scoreboard extends Component {
  render() {
    const { gameStarted } = this.props;

    if (!gameStarted) {
      return <Redirect to="/" />
    }
    return (
      <div>Scoreboard</div>
    );
  }
}

export default withTracker(() => ({
  gameStarted: hasGameStarted(),
}))(Scoreboard);
