import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header } from 'semantic-ui-react';

import NewPlayerInput from './NewPlayerInput';
import Player from './Player';
import TeamSettingsEditor from './TeamSettingsEditor';

import {
  getActiveGame,
  getTeams,
  changeTeamName,
  changeTeamColor,
  addPlayerToGame,
  removePlayerFromGame,
} from '../api/games';
import { getPlayers, addPlayer } from '../api/players';

class TeamEditor extends Component {
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

  handlePlayerRemove = targetId => {
    removePlayerFromGame(targetId);
  }

  render() {
    const {
      game: { players, teams },
      allPlayers,
      teamPlayers,
      onSearchChange,
      onPlayerSelect,
      onPlayerAdd,
      onPlayerRemove,
    } = this.props;

    const { newPlayerName } = this.state;

    return (
      <Fragment>
        <Grid.Row>
          <Grid.Column width={8} className='replay-team-column'>
            <TeamSettingsEditor
              label='Team A'
              name={teams[0].name}
              color={teams[0].color}
              onChangeName={(event, { value }) => changeTeamName(0, value)}
              onChangeColor={({ hex }) => changeTeamColor(0, hex)}
            />
            {teamPlayers[0].map(({ name, _id }, idx) => (
              <Player key={idx} name={name} onClick={() => this.handlePlayerRemove(_id)} />
            ))}
          </Grid.Column>
          <Grid.Column width={8} className='replay-team-column'>
            <TeamSettingsEditor
              label='Team B'
              name={teams[1].name}
              color={teams[1].color}
              onChangeName={(event, { value }) => changeTeamName(1, value)}
              onChangeColor={({ hex }) => changeTeamColor(1, hex)}
            />
            {teamPlayers[1].map(({ name, _id }, idx) => (
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
      </Fragment>
    );
  }
}

export default withTracker(() => ({
  game: getActiveGame(),
  teamPlayers: getTeams(),
  allPlayers: getPlayers(),
}))(TeamEditor);
