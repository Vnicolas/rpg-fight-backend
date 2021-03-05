/**
  A data transfer object will define how data will be sent on over the network
**/

import { ObjectId } from 'mongoose';

export class FightDTO {
  readonly winner: ObjectId;
  readonly looser: ObjectId;
  readonly turns: number;
  readonly winnerAttackValue: number;
  readonly looserAttackValue: number;
  readonly winnerHPSubstracted: number;
  readonly looserHPSubstracted: number;
  readonly created_at: Date;
}
