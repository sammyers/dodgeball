import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Button, Input, List, Dropdown, Header, Icon, Grid, Segment } from 'semantic-ui-react';

import TeamEditor from './TeamEditor';
import NewPlayerInput from './NewPlayerInput';
import RulesEditor from './RulesEditor';

import { getActiveGame, createGame, startGame, clearGame } from '../api/games';
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
    this.setState({ currentPlayers: this.state.currentPlayers.concat(value) });
  }

  handlePlayerAdd = () => {
    this.setState({
      currentPlayers: this.state.currentPlayers.concat(
        addPlayer(this.state.newPlayerName)
      ),
      newPlayerName: '',
    });
  }

  handlePlayerRemove = targetId => {
    this.setState({
      currentPlayers: this.state.currentPlayers.filter(id => id !== targetId),
    });
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
    const { gameActive, gameStarted, allPlayers, playerMap, game } = this.props;
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
    if (game && game.timeEnded && !game.cleared) {
      return (
        <div>
          Game Over
          <Button content='Clear game' onClick={() => clearGame()} />
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
      return (
        <div>
          <Button
            inverted
            color='green'
            icon='play circle'
            content='Start Game'
            size='huge'
            onClick={() => startGame(game._id)}
          />
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
                  <Button
                    size='large'
                    color='red'
                    icon='remove user'
                    labelPosition='left'
                    label={{
                      basic: true,
                      content: playerMap[id],
                      pointing: false,
                    }}
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
  allPlayers: getPlayers(),
  playerMap: getPlayers().reduce(
    (all, { _id, name }) => ({ ...all, [_id]: name }),
    {}
  ),
}))(StartPage);
