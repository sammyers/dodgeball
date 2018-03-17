import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Header, Grid } from 'semantic-ui-react';

import ScoreColumn from './ScoreColumn';
import TeamBackground from '../TeamBackground';

import { getActiveGame, getGameScore, getWinningTeam, getTeams } from '../../api/games';
import { getPlayers } from '../../api/players';

import { valueMap } from '../colors';

class Scoreboard extends Component {
  render() {
    const {
      gameActive,
      gameStarted,
      game,
      playerMap,
      teamPlayers,
      score,
      winningTeam,
    } = this.props;

    if (!gameStarted) {
      if (gameActive) {
        return (
          <div className='game-not-started'>
            <TeamBackground />
            <div className='scoreboard-rules'>
              <div className='game-not-started-message'>Rules</div>
              <div className='game-not-started-rules'>
                <ul>
                  <li>Hit an opponent to score one point, catch the ball they threw to score two points.</li>
                  <li>When you get out, click on the type of out below your name on the reporting computer ("Got Hit" or "Got Caught").</li>
                  <li>When you're out, the timer below your name shows how long until you return.</li>
                  <li>When the entire opposing team is out at once, you get a bonus. They then all return to the game.</li>
                  <li>The first team to reach {game.rules.scoreLimit} points wins the game!</li>
                </ul>
              </div>
            </div>
            <div className='scoreboard-teams'>
              <div className='game-not-started-message'>Teams</div>
              <Grid textAlign='center' style={{ width: '100%' }} columns={2}>
                <Grid.Row>
                  <Grid.Column className='scoreboard-team-list'>
                    {teamPlayers[0].map(({ name }) => (
                      <div className='scoreboard-player'>{name}</div>
                    ))}
                  </Grid.Column>
                  <Grid.Column className='scoreboard-team-list'>
                    {teamPlayers[1].map(({ name }) => (
                      <div className='scoreboard-player'>{name}</div>
                    ))}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
        );
      }

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
              teamName={teamA.name || 'Team A'}
              score={score[0]}
              scoreLimit={scoreLimit}
              progressColor={valueMap[teamA.color]}
            />
            <ScoreColumn
              teamNumber={1}
              teamName={teamB.name || 'Team B'}
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
  playerMap: getPlayers().reduce(
    (all, { _id, name }) => ({ ...all, [_id]: name }),
    {}
  ),
  teamPlayers: getTeams(),
  score: getGameScore(),
  winningTeam: getWinningTeam(),
}))(Scoreboard);
