/**
  Will be used for type-checking and to determine the type
  of values that will be received by the application
**/

import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly password: string;
  // TODO: Array of Character
  readonly characters: any[];
  readonly created_at: Date;
}
