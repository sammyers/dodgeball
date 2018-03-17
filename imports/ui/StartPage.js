import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { Button, Input, List, Dropdown, Header, Icon, Grid, Segment } from 'semantic-ui-react';

import TeamSettingsEditor from './TeamSettingsEditor';
import NewPlayerInput from './NewPlayerInput';
import RulesEditor from './RulesEditor';
import Player from './Player';
import ReplayScreen from './ReplayScreen';
import TeamEditor from './TeamEditor';

import {
  getActiveGame,
  createGame,
  startGame,
  clearGame,
  shuffleTeams,
  restartGame,
  getTeams,
  addPlayerToGame,
  removePlayerFromGame,
} from '../api/games';
import { getPlayers, addPlayer } from '../api/players';

import { nameMap } from './colors';

class StartPage extends Component {
  state = {
    teamNames: ['', ''],
    teamColors: [nameMap['red'], nameMap['blue']],
    currentPlayers: [],
    rules: {
      respawnTime: 3,
      increaseRespawnTime: true,
      scoreLimit: 20,
    },
    redirect: null,
    newPlayerName: '',
  }

  hasGameEnded = () => this.props.game && this.props.game.timeEnded && !this.props.game.cleared

  handleTeamNameChange = (index, name) => {
    const newNames = this.state.teamNames.slice();
    newNames[index] = name;
    this.setState({ teamNames: newNames });
  }

  handleTeamColorChange = (index, color) => {
    const newColors = this.state.teamColors.slice();
    newColors[index] = color;
    this.setState({ teamColors: newColors });
  }

  handleSearchChange = (event, { searchQuery }) => {
    this.setState({ newPlayerName: searchQuery });
  }

  handlePlayerSelect = (event, { value }) => {
    if (this.hasGameEnded()) {
      addPlayerToGame(value);
      this.setState({ newPlayerName: '' });
    } else {
      this.setState({
        currentPlayers: this.state.currentPlayers.concat(value),
        newPlayerName: '',
      });
    }
  }

  handlePlayerAdd = () => {
    if (this.hasGameEnded()) {
      addPlayerToGame(addPlayer(this.state.newPlayerName));
      this.setState({ newPlayerName: '' });
    } else {
      this.setState({
        currentPlayers: this.state.currentPlayers.concat(
          addPlayer(this.state.newPlayerName)
        ),
        newPlayerName: '',
      });
    }
  }

  handlePlayerRemove = targetId => {
    if (this.hasGameEnded()) {
      removePlayerFromGame(targetId);
    } else {
      this.setState({
        currentPlayers: this.state.currentPlayers.filter(id => id !== targetId),
      });
    }
  }

  handleRuleChange = (rule, value) => {
    this.setState({
      rules: {
        ...this.state.rules,
        [rule]: value,
      },
    });
  }

  handleCreateGame = () => {
    createGame(
      this.state.currentPlayers,
      this.state.rules
    );
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  render() {
    const { gameActive, gameStarted, allPlayers, playerMap, game, teamPlayers } = this.props;
    const {
      redirect,
      teamNames,
      teamColors,
      currentPlayers,
      newPlayerName,
      rules,
    } = this.state;

    if (redirect) {
      return <Redirect push to={redirect} />
    }
    if (this.hasGameEnded()) {
      return (
        <ReplayScreen />
      );
    }
    if (gameStarted) {
      return (
        <div className='start-page'>
          <Grid textAlign='center'>
            <Grid.Row>
              <Header>Game in progress</Header>
            </Grid.Row>
            <Grid.Row>
              <Button
                primary
                content='View Scoreboard'
                icon='trophy'
                onClick={() => this.handleRedirect('/scoreboard')}
              />
            </Grid.Row>
            <Grid.Row>
              <Button
                primary
                content='Go to Player Hub'
                icon='users'
                onClick={() => this.handleRedirect('/player-hub')}
              />
            </Grid.Row>
          </Grid>
        </div>
      );
    }
    if (gameActive) {
      const { players } = game;
      return (
        <div className='start-page'>
          <Grid textAlign='center'>
            <TeamEditor />
            <Grid.Row>
              <Button content='Shuffle Teams' icon='shuffle' onClick={() => shuffleTeams()} />
            </Grid.Row>
            <Grid.Row>
              <Button
                inverted
                color='green'
                icon='play circle'
                content='Start Game'
                size='huge'
                onClick={() => startGame(game._id)}
              />
            </Grid.Row>
            <Grid.Row>
              <Button
                inverted
                content='Cancel'
                icon='undo'
                color='red'
                onClick={() => clearGame()} />
            </Grid.Row>
          </Grid>
        </div>
      );
    }
    return (
      <div className='start-page'>
        <Grid relaxed padded textAlign='center'>
          <Grid.Row textAlign='center'>
            <Header as='h3'>
              <Icon name='users' />
              <Header.Content>Players</Header.Content>
            </Header>
            <Grid relaxed columns={5} style={{ width: '100%', height: 'fit-content' }}>
              {currentPlayers.map((id, index) => (
                <Grid.Column key={id}>
                  <Player
                    name={playerMap[id]}
                    onClick={() => this.handlePlayerRemove(id)}
                  />
                </Grid.Column>
              ))}
            </Grid>
            <NewPlayerInput
              allPlayers={allPlayers}
              currentPlayers={currentPlayers}
              value={newPlayerName}
              onSearchChange={this.handleSearchChange}
              onSelect={this.handlePlayerSelect}
              onPlayerAdd={this.handlePlayerAdd}
            />
          </Grid.Row>
          <Grid.Row>
            <RulesEditor rules={rules} onChange={this.handleRuleChange} />
          </Grid.Row>
          <Grid.Row>
            <Button
              inverted
              color='green'
              icon='play circle'
              content='Create Game'
              size='huge'
              onClick={this.handleCreateGame}
            />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default withTracker(() => ({
  gameActive: !!getActiveGame(),
  gameStarted: !!(getActiveGame() || {}).timeStarted,
  game: getActiveGame(),
  teamPlayers: getTeams(),
  allPlayers: getPlayers(),
  playerMap: getPlayers().reduce(
    (all, { _id, name }) => ({ ...all, [_id]: name }),
    {}
  ),
}))(StartPage);
