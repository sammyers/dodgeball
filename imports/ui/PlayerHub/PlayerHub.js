import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { hasGameStarted } from '../../api/games';

class PlayerHub extends Component {
  render() {
    const { gameStarted } = this.props;

    if (!gameStarted) {
      return <Redirect to="/" />
    }
    return (
      <div>Player Hub</div>
    );
  }
}

export default withTracker(() => ({
  gameStarted: hasGameStarted(),
}))(PlayerHub);
