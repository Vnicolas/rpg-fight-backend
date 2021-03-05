/**
  Mongoose database schema that will determine the data that should be stored in the database.
**/

import { EntitySchema } from 'typeorm';
import { IUser } from '../interfaces/user.interface';

export const UserSchema = new EntitySchema<IUser>({
  name: 'user',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String, nullable: false },
    password: { type: String, nullable: false },
  },
  relations: {
    characters: {
      type: 'one-to-many',
      target: 'characters',
    },
  },
});
