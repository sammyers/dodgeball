import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import _ from 'lodash';

import { Grid, Segment, Header, Icon } from 'semantic-ui-react';

import Timer from './Timer';
import PlayerCard from './PlayerCard';
import TeamBackground from './TeamBackground';
import NewPlayerInput from './NewPlayerInput';

import { getActiveGame, getTeams, rebalanceTeams, addPlayerToGame } from '../api/games';
import { getPlayers, addPlayer } from '../api/players';

class PlayerHub extends Component {
  state = { newPlayerName: '' }

  handleSearchChange = (event, { searchQuery }) => {
    this.setState({ newPlayerName: searchQuery });
  }

  handlePlayerSelect = (event, { value }) => {
    addPlayerToGame(value);
    this.setState({ newPlayerName: '' });
  }

  handlePlayerAdd = () => {
    addPlayerToGame(addPlayer(this.state.newPlayerName));
    this.setState({ newPlayerName: '' });
  }

  render() {
    const { gameActive, gameStarted, game, teams, allPlayers } = this.props;

    if (!gameActive) {
      return <Redirect to="/" />
    }

    const { teams: [ teamA, teamB ], players } = game;

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
          <Grid.Row>
            <NewPlayerInput
              allPlayers={allPlayers}
              currentPlayers={_.keys(players)}
              value={this.state.newPlayerName}
              onSearchChange={this.handleSearchChange}
              onSelect={this.handlePlayerSelect}
              onPlayerAdd={this.handlePlayerAdd}
            />
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
  allPlayers: getPlayers(),
}))(PlayerHub);
