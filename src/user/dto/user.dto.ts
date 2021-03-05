/**
  A data transfer object will define how data will be sent on over the network
**/

export class UserDTO {
  readonly name: string;
  readonly password: string;
  readonly characters: string[] = [];
}
