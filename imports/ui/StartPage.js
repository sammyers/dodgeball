import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { Button, Input, List, Dropdown, Header, Icon, Grid, Segment } from 'semantic-ui-react';

import TeamEditor from './TeamEditor';
import NewPlayerInput from './NewPlayerInput';
import RulesEditor from './RulesEditor';
import Player from './Player';

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
    let [colorA, colorB] = this.state.teamColors;
    const teamA = this.state.teamNames[0] || 'Team A';
    const teamB = this.state.teamNames[1] || 'Team B';
    createGame(
      [
        { name: teamA, color: colorA },
        { name: teamB, color: colorB }
      ],
      this.state.currentPlayers,
      this.state.rules
    );
  }

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  render() {
    const { gameActive, gameStarted, allPlayers, playerMap, game, teams } = this.props;
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
      const { players } = game;
      return (
        <div>
          <Grid textAlign='center'>
            <Grid.Row>
              <Header as='h2' content='Game Over!' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8} className='replay-team-column'>
                <Header as='h3' content={game.teams[0].name} />
                {teams[0].map(({ name, _id }, idx) => (
                  <Player key={idx} name={name} onClick={() => this.handlePlayerRemove(_id)} />
                ))}
              </Grid.Column>
              <Grid.Column width={8} className='replay-team-column'>
                <Header as='h3' content={game.teams[1].name} />
                {teams[1].map(({ name, _id }, idx) => (
                  <Player key={idx} name={name} onClick={() => this.handlePlayerRemove(_id)} />
                ))}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <NewPlayerInput
                allPlayers={allPlayers}
                currentPlayers={_.keys(players)}
                value={newPlayerName}
                onSearchChange={this.handleSearchChange}
                onSelect={this.handlePlayerSelect}
                onPlayerAdd={this.handlePlayerAdd}
              />
            </Grid.Row>
            <Grid.Row>
              <Button content='Shuffle Teams' icon='shuffle' onClick={() => shuffleTeams()} />
            </Grid.Row>
            <Grid.Row>
              <Button
                inverted
                color='green'
                icon='play circle'
                content='Restart Game'
                size='huge'
                onClick={() => restartGame()}
              />
            </Grid.Row>
            <Grid.Row>
              <Button
                inverted
                content='Clear game'
                icon='checkmark box'
                color='red'
                onClick={() => clearGame()} />
            </Grid.Row>
          </Grid>
        </div>
      );
    }
    if (gameStarted) {
      return (
        <div>
          Game in progress
          <Button
            primary
            content='View Scoreboard'
            icon='trophy'
            onClick={() => this.handleRedirect('/scoreboard')}
          />
          <Button
            primary
            content='Go to Player Hub'
            icon='users'
            onClick={() => this.handleRedirect('/player-hub')}
          />
        </div>
      );
    }
    if (gameActive) {
      const { players } = game;
      return (
        <div>
          <Grid>
            {/*<Grid.Row>
              <Grid.Column width={8}>
                {teams[0].map(({ name, _id }, idx) => (
                  <Player key={idx} name={name} onClick={() => this.handlePlayerRemove(_id)} />
                ))}
              </Grid.Column>
              <Grid.Column width={8}>
                {teams[1].map(({ name, _id }, idx) => (
                  <Player key={idx} name={name} onClick={() => this.handlePlayerRemove(_id)} />
                ))}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <NewPlayerInput
                allPlayers={allPlayers}
                currentPlayers={_.keys(players)}
                value={newPlayerName}
                onSearchChange={this.handleSearchChange}
                onSelect={this.handlePlayerSelect}
                onPlayerAdd={this.handlePlayerAdd}
              />
            </Grid.Row>*/}
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
          </Grid>
        </div>
      );
    }
    return (
      <div>
        <Grid relaxed padded textAlign='center'>
          <Grid.Row>
            <Header as='h3'>
              <Icon name='protect' />
              <Header.Content>Teams</Header.Content>
            </Header>
            <Grid style={{ width: '100%' }}>
              <Grid.Row>
                <Grid.Column width={8}>
                  <TeamEditor
                    label='Team A'
                    name={teamNames[0]}
                    color={teamColors[0]}
                    onChangeName={(event, { value }) => this.handleTeamNameChange(0, value)}
                    onChangeColor={({ hex }) => this.handleTeamColorChange(0, hex)}
                  />
                </Grid.Column>
                <Grid.Column width={8}>
                  <TeamEditor
                    label='Team B'
                    name={teamNames[1]}
                    color={teamColors[1]}
                    onChangeName={(event, { value }) => this.handleTeamNameChange(1, value)}
                    onChangeColor={({ hex }) => this.handleTeamColorChange(1, hex)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Row>
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
  teams: getTeams(),
  allPlayers: getPlayers(),
  playerMap: getPlayers().reduce(
    (all, { _id, name }) => ({ ...all, [_id]: name }),
    {}
  ),
}))(StartPage);
