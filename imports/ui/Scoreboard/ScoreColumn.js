import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Grid, Segment, Progress, Header, Icon } from 'semantic-ui-react';

import PlayerCard from '../PlayerCard';

import { getActiveGame, getNextPlayerIn, getPlayersOut } from '../../api/games';
import { getPlayers } from '../../api/players';

class ScoreColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextIn: getNextPlayerIn(this.props.game, this.props.teamNumber),
      numPlayersOut: getPlayersOut(this.props.game, this.props.teamNumber).length,
    };
  }

  tick = () => {
    console.log('tick');
    this.setState({
      nextIn: getNextPlayerIn(this.props.game, this.props.teamNumber),
      numPlayersOut: getPlayersOut(this.props.game, this.props.teamNumber).length,
    });
  }

  componentDidMount() {
    this.tick();
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {
      game,
      players,
      teamNumber,
      teamName,
      score,
      scoreLimit,
      progressColor,
      numPlayers,
      numPlayersIn,
    } = this.props;

    const { nextIn, numPlayersOut } = this.state;

    const nextPlayer = nextIn ?
        players.find(player => player._id === nextIn.playerId)
        : {};

    const playersOnTeam = Object.entries(game.players).filter(
      ([player, team]) => team === teamNumber
    ).length;

    return (
      <Grid.Column width={8}>
        <div className='team-name' style={{ marginTop: '3em' }}>{teamName}</div>
        <div className='team-score'>{score}</div>
        <Progress
          active
          inverted
          value={score}
          total={scoreLimit}
          progress='ratio'
          color={progressColor}
          size='large'
          style={{ marginTop: 0 }}
        />
        <Header as='h3' textAlign='center' style={{
          color: 'white',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Icon name='users' />
          <Header.Content>
            {`${playersOnTeam - numPlayersOut} out of ${playersOnTeam} players currently in`}
          </Header.Content>
        </Header>
        {nextIn && (
          <div style={{ marginTop: '5em' }}>
            <Header size='large' content='Next Player In' style={{ color: 'white' }} />
            <PlayerCard player={nextPlayer} report={false} />
          </div>
        )}
      </Grid.Column>
    );
  }
}

export default withTracker(({ teamNumber }) => ({
  game: getActiveGame() || {},
  players: getPlayers() || {},
}))(ScoreColumn);
