import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import _ from 'lodash';

import { getPlayer } from './players';

export const Games = new Mongo.Collection('games');

export const getActiveGame = () => Games.findOne({ $or: [{ active: true }, { cleared: false }] });

const shufflePlayers = players => {
  const newPlayers = players.slice();
  for (let i = newPlayers.length - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = newPlayers[i];
    newPlayers[i] = newPlayers[j];
    newPlayers[j] = temp;
  }
  return newPlayers;
};

export const createTeams = players => {
  const shuffledPlayers = shufflePlayers(players);
  const groupedPlayers = {};
  return shuffledPlayers.reduce((all, id, index) => {
    let team = 0;
    if (index < shuffledPlayers.length / 2) {
      team = 1;
    }
    return { ...all, [id]: team };
  }, {});
};

export const createGame = (teams, players, rules) => {
  Games.insert({
    active: true,
    timeStarted: null,
    timeEnded: null,
    players: createTeams(players),
    playersOut: [],
    rules,
    teams,
    switchSides: false,
    cleared: false,
  });
};

export const getTeams = () => {
  const { players } = getActiveGame() || {};
  if (!players) {
    return;
  }
  return Object.entries(players).reduce(
    (teams, [ id, team ]) => {
      const newTeams = teams.slice();
      newTeams[team].push(getPlayer(id));
      return newTeams;
    },
    [[], []]
  );
};

export const rebalanceTeams = () => {
  const teams = getTeams();
  const diff = teams[0].length - teams[1].length;
  const absDiff = Math.abs(diff);
  if (absDiff > 1) {
    const largerTeam = diff > 0 ? 0 : 1;
    const numTrades = Math.floor(absDiff / 2);
    const trades = teams[largerTeam].splice(-numTrades, numTrades);
    teams[1 - largerTeam].push(...trades);
    const players = teams.reduce((all, team, idx) => {
      return team.reduce((_all, { _id }) => ({
        ..._all,
        [_id]: idx,
      }), all);
    }, {});
    Games.update(getActiveGame()._id, { $set: { players } });
  }
};

export const addPlayerToGame = id => {
  const { _id } = getActiveGame();
  const teams = getTeams();
  const selectedTeam = teams[0].length > teams[1].length ? 1 : 0;
  Games.update(_id, { $set: { [`players.${id}`]: selectedTeam } });
};

export const removePlayerFromGame = id => {
  const { _id } = getActiveGame();
  Games.update(_id, { $unset: { [`players.${id}`]: '' } });
  rebalanceTeams();
};

export const startGame = gameId => {
  Games.update(gameId, { $set: { timeStarted: new Date() } });
};

export const getGameScore = () => {
  const game = getActiveGame();
  if (!game) {
    return;
  }

  return game.playersOut.reduce((score, { playerId, outType }) => {
    const newScore = score.slice();
    const scoringTeam = 1 - game.players[playerId];
    newScore[scoringTeam] += (outType === 'catch' ? 2 : 1);
    return newScore;
  }, [0, 0]);
};

export const getWinningTeam = () => {
  const { teams } = (getActiveGame() || {});
  if (!teams) {
    return;
  }
  const [ scoreA, scoreB ] = getGameScore();
  if (scoreA > scoreB) {
    return teams[0].name;
  }
  return teams[1].name;
}

export const getLastOut = player => {
  const { playersOut } = getActiveGame();
  return playersOut.find(
    ({ playerId, timeIn }) => playerId === player && moment(timeIn).isAfter(moment())
  );
};

export const countOuts = player => {
  const { playersOut } = getActiveGame();
  return playersOut.filter(({ playerId }) => playerId === player).length;
};

export const reportOut = (playerId, outType) => {
  const { _id, rules: { respawnTime, increaseRespawnTime, scoreLimit }} = getActiveGame();
  const previousOuts = countOuts(playerId);
  const penalty = increaseRespawnTime ? previousOuts : 0;
  Games.update(_id, {
    $push: {
      playersOut: {
        playerId,
        outType,
        timeOut: new Date(),
        timeIn: moment().add(penalty + respawnTime, 'minutes').toDate()
      }
    }
  });

  const [ teamA, teamB ] = getGameScore();
  if (teamA >= scoreLimit || teamB >= scoreLimit) {
    Games.update(_id, {
      $set: {
        active: false,
        timeEnded: new Date()
      } 
    });
  }
};

export const clearGame = () => {
  const { _id } = getActiveGame();
  Games.update({ _id }, { cleared: true });
};

export const replayGame = () => {

};

export const getPlayersOut = ({ players, playersOut }, team) => {
  const now = moment();
  return playersOut.filter(
    ({ playerId, timeIn }) => players[playerId] === team && moment(timeIn).isAfter(now)
  );
}

export const getNextPlayerIn = (game, team) => {
  const now = moment();
  const outsOnTeam = getPlayersOut(game, team);
  if (!outsOnTeam.length) {
    return;
  }
  outsOnTeam.sort((a, b) => {
    return moment(a.timeIn).diff(moment(b.timeIn))
  });
  return outsOnTeam[0];
};
