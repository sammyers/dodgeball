import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Grid, Segment, Header, Icon } from 'semantic-ui-react';

import Timer from './Timer';
import PlayerCard from './PlayerCard';
import TeamBackground from './TeamBackground';

import { getActiveGame, getTeams } from '../api/games';

class PlayerHub extends Component {
  render() {
    const { gameActive, gameStarted, game, teams } = this.props;

    if (!gameActive) {
      return <Redirect to="/" />
    }

    const { teams: [ teamA, teamB ] } = game;

    return (
      <div>
        <TeamBackground colors={[teamA.color, teamB.color]} />
        <Grid textAlign='center'>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='team-name'>{teamA.name}</div>
              {teams[0].map((player, idx) => <PlayerCard player={player} key={idx} />)}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className='team-name'>{teamB.name}</div>
              {teams[1].map((player, idx) => <PlayerCard player={player} key={idx} />)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default withTracker(() => ({
  gameActive: !!getActiveGame(),
  game: getActiveGame(),
  teams: getTeams(),
}))(PlayerHub);
