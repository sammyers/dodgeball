import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Button } from 'semantic-ui-react';

import TeamEditor from './TeamEditor';

import { shuffleTeams, restartGame, clearGame } from '../api/games';

const ReplayScreen = () => (
  <div className='start-page'>
    <Grid textAlign='center'>
      <Grid.Row>
        <Header as='h2' content='Game Over!' />
      </Grid.Row>
      <TeamEditor />
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

export default ReplayScreen;
