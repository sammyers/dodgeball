import { Mongo } from 'meteor/mongo';

export const Players = new Mongo.Collection('players');

export const getPlayers = () => Players.find({}).fetch();

export const getPlayer = id => Players.findOne(id);

export const addPlayer = name => Players.insert({ name });
