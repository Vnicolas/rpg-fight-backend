/**
  Mongoose database schema that will determine the data that should be stored in the database.
**/

import * as mongoose from 'mongoose';

export const CharacterSchema = new mongoose.Schema({
  picture: { type: String, required: true },
  name: { type: String, required: true },
  skillPoints: { type: Number, default: 12 },
  rank: { type: Number, default: 1 },
  health: { type: Number, default: 0 },
  attack: { type: Number, default: 0 },
  defense: { type: Number, default: 0 },
  magik: { type: Number, default: 0 },
  fights: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fight',
      default: [],
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});
