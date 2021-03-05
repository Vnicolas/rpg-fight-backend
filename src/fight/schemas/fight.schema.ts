/**
  Mongoose database schema that will determine the data that should be stored in the database.
**/

import * as mongoose from 'mongoose';

export const FightSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  },
  looser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  },
  turns: Number,
  winnerAttackValue: Number,
  looserAttackValue: Number,
  winnerHPSubstracted: Number,
  looserHPSubstracted: Number,
  created_at: { type: Date, default: Date.now },
});
