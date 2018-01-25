import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Games } from '../../api/games';

class StartPage extends Component {
  state = {
    players: [],
    rules: {}
  }

  render() {
    return (
      <div>Start Page</div>
    );
  }
}

export default withTracker(() => ({
  gameStarted: !!Games.findOne({ active: true }),
}))(StartPage);
