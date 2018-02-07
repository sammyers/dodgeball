import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Header, Grid } from 'semantic-ui-react';

import ScoreColumn from './ScoreColumn';
import TeamBackground from '../TeamBackground';

import { getActiveGame, getGameScore, getWinningTeam } from '../../api/games';

import { valueMap } from '../colors';

class Scoreboard extends Component {
  render() {
    const { gameActive, gameStarted, game, score, winningTeam } = this.props;

    if (!gameStarted) {
      return (
        <div className='game-not-started'>
          <TeamBackground />
          <div className='game-not-started-message'>Game has not yet started</div>
        </div>
      );
    }

    const { teams: [ teamA, teamB ], rules: { scoreLimit }, timeStarted } = game;

    if (game && game.timeEnded && !game.cleared) {
      return (
        <div className='game-not-started'>
          <TeamBackground colors={[teamA.color, teamB.color]} />
          <div className='game-not-started-message'>Game Over!</div>
          <div className='game-not-started-message'>{winningTeam} won the game.</div>
        </div>
      );
    }

    return (
      <div className='scoreboard'>
        <TeamBackground colors={[teamA.color, teamB.color]} />
        <Grid textAlign='center' verticalAlign='middle'>
          <Grid.Row>
            <ScoreColumn
              teamNumber={0}
              teamName={teamA.name}
              score={score[0]}
              scoreLimit={scoreLimit}
              progressColor={valueMap[teamA.color]}
            />
            <ScoreColumn
              teamNumber={1}
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
  winningTeam: getWinningTeam(),
}))(Scoreboard);
