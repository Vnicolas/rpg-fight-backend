/**
  A data transfer object will define how data will be sent on over the network
**/

import { ObjectId } from 'mongoose';

export class UserDTO {
  readonly name: string;
  readonly password: string;
  readonly characters: ObjectId[];
  readonly created_at: Date;
}
