/**
  Will be used for type-checking and to determine the type
  of values that will be received by the application
**/

import { Document } from 'mongoose';
import { IFight } from 'src/fight/interfaces/fight.interface';
import { IUser } from 'src/user/interfaces/user.interface';

export interface ICharacter extends Document {
  readonly picture: string;
  readonly name: string;
  readonly skillPoints: number;
  readonly rank: number;
  readonly health: number;
  readonly attack: number;
  readonly defense: number;
  readonly magik: number;
  readonly fights: IFight[];
  readonly owner: IUser;
}