import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Button, Input, List, Dropdown } from 'semantic-ui-react';

import { hasGameStarted, createTeams } from '../../api/games';
import { getPlayers, addPlayer } from '../../api/players';

window.createTeams = createTeams;

class StartPage extends Component {
  state = {
    teamNames: ['', ''],
    currentPlayers: [],
    rules: {},
    redirect: null,
    newPlayerName: '',
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

  handleRedirect(path) {
    this.setState({ redirect: path });
  }

  isNewName() {
    return !!this.state.newPlayerName && !this.props.allPlayers.some(
      ({ name }) => name === this.state.newPlayerName
    );
  }

  render() {
    const { gameStarted, allPlayers, playerMap } = this.props;
    const {
      redirect,
      teamNames: [teamA, teamB],
      currentPlayers,
      newPlayerName,
    } = this.state;

    if (redirect) {
      return <Redirect push to={redirect} />
    }
    if (gameStarted) {
      return (
        <div>
          Game in progress
          <Button primary onClick={() => this.handleRedirect('/scoreboard')}>
            View Scoreboard
          </Button>
          <Button primary onClick={() => this.handleRedirect('/player-hub')}>
            Go to Player Hub
          </Button>
        </div>
      );
    }
    return (
      <div>
        <div className='team-names'>
          <Input label='Team A' placeholder='Add Name' value={teamA} />
          <Input label='Team B' placeholder='Add Name' value={teamB} />
        </div>
        <div className='player-list'>
          <List relaxed>
            {currentPlayers.map((id, index) => (
              <List.Item key={id}>
                <Button
                  color='red'
                  icon='remove'
                  labelPosition='left'
                  label={{
                    basic: true,
                    content: playerMap[id],
                    pointing: false,
                  }}
                  onClick={() => this.handlePlayerRemove(id)}
                />
              </List.Item>
            ))}
          </List>
          <div className='new-player'>
            <Dropdown
              search
              selection
              selectOnBlur={false}
              selectOnNavigation={false}
              placeholder='New Player Name'
              noResultsMessage='No players found.'
              value=''
              options={
                allPlayers.filter(
                  ({ _id }) => !currentPlayers.includes(_id)
                ).map(
                  ({ _id, name }) => ({ key: _id, value: _id, text: name })
                )
              }
              searchQuery={newPlayerName}
              onSearchChange={this.handleSearchChange}
              onChange={this.handlePlayerSelect}
            />
            {this.isNewName() && <Button onClick={this.handlePlayerAdd}>Add New Player</Button>}
          </div>
        </div>
        <Button primary>Start Game</Button>
      </div>
    );
  }
}

export default withTracker(() => ({
  gameStarted: hasGameStarted(),
  allPlayers: getPlayers(),
  playerMap: getPlayers().reduce(
    (all, { _id, name }) => ({ ...all, [_id]: name }),
    {}
  ),
}))(StartPage);
