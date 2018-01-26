import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Header, Grid } from 'semantic-ui-react';

import ScoreColumn from './ScoreColumn';
import TeamBackground from '../TeamBackground';

import { getActiveGame, getGameScore } from '../../api/games';

import { valueMap } from '../colors';

class Scoreboard extends Component {
  render() {
    const { gameActive, gameStarted, game, score } = this.props;

    if (!gameStarted) {
      return (
        <div>
          <TeamBackground />
          Game not yet started
        </div>
      );
    }

    const { teams: [ teamA, teamB ], rules: { scoreLimit }, timeStarted } = game;

    return (
      <div className='scoreboard'>
        <TeamBackground colors={[teamA.color, teamB.color]} />
        <Grid textAlign='center' verticalAlign='middle'>
          <Grid.Row>
            <ScoreColumn
              teamName={teamA.name}
              score={score[0]}
              scoreLimit={scoreLimit}
              progressColor={valueMap[teamA.color]}
            />
            <ScoreColumn
              teamName={teamB.name}
              score={score[1]}
              scoreLimit={scoreLimit}
              progressColor={valueMap[teamB.color]}
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
  score: getGameScore(),
}))(Scoreboard);
