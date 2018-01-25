import { Mongo } from 'meteor/mongo';

export const Games = new Mongo.Collection('games');

export const hasGameStarted = () => !!Games.findOne({ active: true });

export const createTeams = players => {
  const allPlayers = players.slice();
  const groupedPlayers = [];
  for (let i = 0; i < Math.ceil(players.length / 2); i++) {
    const index = Math.floor(Math.random() * (players.length - 1));
    const [ id ] = allPlayers.splice(index, 1);
    groupedPlayers.push({ id, team: 0 });
  }
  return groupedPlayers.concat(allPlayers.map(id => ({ id, team: 1 })));
};

export const createGame = (teamNames, players, rules) => {
  Games.insert({
    active: true,
    timeStarted: null,
    players: createTeams(players),
    playersOut: [],
    rules,
    teamNames,
    switchSides: false,
  });
};

export const startGame = gameId => {
  Games.update(gameId, { $set: { timeStarted: new Date() } });
};
