import { Mongo } from 'meteor/mongo';
import moment from 'moment';

import { getPlayer } from './players';

export const Games = new Mongo.Collection('games');

export const getActiveGame = () => Games.findOne({ active: true });

export const createTeams = players => {
  const allPlayers = players.slice();
  const groupedPlayers = {};
  for (let i = 0; i < Math.ceil(players.length / 2); i++) {
    const index = Math.floor(Math.random() * (players.length - 1));
    const [ id ] = allPlayers.splice(index, 1);
    groupedPlayers[id] = 0;
  }
  return {
    ...groupedPlayers,
    ...allPlayers.reduce((all, id) => ({ ...all, [id]: 1 }), {})
  };
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
  });
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
  const { _id, rules: { respawnTime, increaseRespawnTime }} = getActiveGame();
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
};
