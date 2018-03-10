import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import _ from 'lodash';

import { Grid, Segment, Header, Icon, Checkbox } from 'semantic-ui-react';

import Timer from './Timer';
import PlayerCard from './PlayerCard';
import TeamBackground from './TeamBackground';
import NewPlayerInput from './NewPlayerInput';

import { getActiveGame, getTeams, rebalanceTeams, addPlayerToGame } from '../api/games';
import { getPlayers, addPlayer } from '../api/players';

class PlayerHub extends Component {
  state = { newPlayerName: '', mirror: false }

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

  handleToggleMirror = () => {
    this.setState({ mirror: !this.state.mirror });
  }

  render() {
    const { gameActive, gameStarted, game, teams, allPlayers } = this.props;
    const { newPlayerName, mirror } = this.state;

    if (!gameActive || game.timeEnded) {
      return <Redirect to="/" />
    }

    const { teams: [ teamA, teamB ], players } = game;

    const teamColors = mirror ? [teamB.color, teamA.color] : [teamA.color, teamB.color];

    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '2em',
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Header as='h4' content='Mirror' style={{ color: 'white' }} />
          <Checkbox toggle onChange={this.handleToggleMirror} />
        </div>
        <TeamBackground colors={teamColors} />
        <Grid textAlign='center'>
          <Grid.Row>
            <Grid.Column width={8}>
              <div className='team-name'>
                {(mirror ? teamB : teamA).name || (mirror ? 'Team B' : 'Team A')}
              </div>
              {teams[mirror ? 1 : 0].map((player, idx) => (
                <PlayerCard player={player} key={idx} />
              ))}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className='team-name'>
                {(mirror ? teamA : teamB).name || (mirror ? 'Team A' : 'Team B')}
              </div>
              {teams[mirror ? 0 : 1].map((player, idx) => (
                <PlayerCard player={player} key={idx} />
              ))}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Header
              as='h2'
              textAlign='center'
              content='Join Game'
              style={{ color: 'white', width: '100%', marginBottom: 0 }}
            />
            <NewPlayerInput
              allPlayers={allPlayers}
              currentPlayers={_.keys(players)}
              value={newPlayerName}
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
