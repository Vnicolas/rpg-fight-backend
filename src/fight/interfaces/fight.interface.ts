/**
  Will be used for type-checking and to determine the type
  of values that will be received by the application
**/

import { Document, ObjectId } from 'mongoose';
import { ITurn } from './turn.interface';

export interface IFight extends Document {
  winnerOwner: ObjectId;
  looserOwner: ObjectId;
  looser: ObjectId;
  winner: ObjectId;
  turns: ITurn[];
  created_at: Date;
}
