import React from 'react';

import { Grid, Segment, Progress } from 'semantic-ui-react';

export default function ScoreColumn({
  teamName,
  score,
  scoreLimit,
  progressColor,
  numPlayers,
  numPlayersIn
}) {
  return (
    <Grid.Column width={8}>
      <div className='team-name'>{teamName}</div>
      <div className='team-score'>{score}</div>
      <Progress
        active
        inverted
        value={score}
        total={scoreLimit}
        progress='ratio'
        color={progressColor}
        size='large'
      />
    </Grid.Column>
  );
}
