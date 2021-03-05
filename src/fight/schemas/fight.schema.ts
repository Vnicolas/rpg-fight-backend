/**
  Mongoose database schema that will determine the data that should be stored in the database.
**/

import { EntitySchema } from 'typeorm';
import { IFight } from '../interfaces/fight.interface';

export const FightSchema = new EntitySchema<IFight>({
  name: 'fight',
  columns: {
    id: { type: Number, primary: true, generated: true },
    turns: { type: Number, default: 0 },
    winnerAttackValue: { type: Number },
    looserAttackValue: { type: Number },
    winnerHPSubstracted: { type: Number },
    looserHPSubstracted: { type: Number },
  },
  relations: {
    winner: {
      type: 'one-to-one',
      target: 'characters',
    },
    looser: {
      type: 'one-to-one',
      target: 'characters',
    },
  },
});
