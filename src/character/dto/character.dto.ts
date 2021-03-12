import { ObjectID as MongoObjectID } from "mongodb";
import { CharacterStatus } from "../interfaces/character.interface";

/*
 * A data transfer object will define how data will be sent on over the network
 */
export class CharacterDTO {
  picture: string;
  owner: MongoObjectID;
  readonly name: string;
  readonly skillPoints: number = 12;
  readonly rank: number = 1;
  readonly health: number = 0;
  readonly attack: number = 0;
  readonly defense: number = 0;
  readonly magik: number = 0;
  readonly fights: MongoObjectID[] = [];
  status: CharacterStatus;
}
