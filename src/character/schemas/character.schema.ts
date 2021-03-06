/**
  Mongoose database schema that will determine the data that should be stored in the database.
**/

import { EntitySchema } from 'typeorm';
import { CharacterStatus, ICharacter } from '../interfaces/character.interface';

export const CharacterSchema = new EntitySchema<ICharacter>({
  name: 'character',
  columns: {
    id: { type: Number, primary: true, generated: true },
    picture: { type: String, nullable: false },
    name: { type: String, nullable: false },
    skillPoints: { type: Number, default: 12 },
    rank: { type: Number, default: 1 },
    health: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    magik: { type: Number, default: 0 },
    status: { type: String, default: CharacterStatus.AVAILABLE },
  },
  relations: {
    owner: {
      type: 'many-to-one',
      target: 'users',
    },
    fights: {
      type: 'one-to-many',
      target: 'fights',
    },
  },
});
