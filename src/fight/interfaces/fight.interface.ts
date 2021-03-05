/**
  Will be used for type-checking and to determine the type
  of values that will be received by the application
**/

import { Document, ObjectId } from 'mongoose';

export interface Fight extends Document {
  readonly winner: ObjectId;
  readonly looser: ObjectId;
  readonly turns: number;
  readonly winnerAttackValue: number;
  readonly looserAttackValue: number;
  readonly winnerHPSubstracted: number;
  readonly looserHPSubstracted: number;
  readonly created_at: Date;
}
