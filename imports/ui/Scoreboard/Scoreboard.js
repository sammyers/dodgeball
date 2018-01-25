import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class Scoreboard extends Component {
  render() {
    return (
      <div>Scoreboard</div>
    );
  }
}

export default withTracker(() => ({
  
}))(Scoreboard);
