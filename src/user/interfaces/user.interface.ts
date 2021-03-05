/**
  Will be used for type-checking and to determine the type
  of values that will be received by the application
**/

import { Document } from 'mongoose';
import { ICharacter } from 'src/character/interfaces/character.interface';

export interface IUser extends Document {
  readonly name: string;
  readonly password: string;
  readonly characters: ICharacter[];
}
