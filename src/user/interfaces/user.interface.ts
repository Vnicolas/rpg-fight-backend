/**
  Will be used for type-checking and to determine the type
  of values that will be received by the application
**/

import { Document, ObjectId } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly password: string;
  readonly characters: ObjectId[];
  readonly created_at: Date;
}
