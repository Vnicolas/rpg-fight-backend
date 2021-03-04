/**
  A data transfer object will define how data will be sent on over the network
**/

export class UserDTO {
  readonly name: string;
  readonly password: string;
  // TODO: Array of Character
  readonly characters: Array<any>;
  readonly created_at: Date;
}
