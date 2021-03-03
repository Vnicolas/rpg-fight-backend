/**
  Mongoose database schema that will determine the data that should be stored in the database.
**/

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  characters: Array,
  created_at: { type: Date, default: Date.now },
});
