import { ObjectID as MongoObjectID } from "mongodb";
import { CharacterStatus } from "../interfaces/character.interface";

/*
 * A data transfer object will define how data will be sent on over the network
 */
export class CharacterDTO {
  picture?: string;
  owner?: MongoObjectID | string;
  name?: string;
  skillPoints?: number;
  rank?: number;
  health?: number;
  attack?: number;
  defense?: number;
  magik?: number;
  fights?: MongoObjectID[] = [];
  status?: CharacterStatus;
  restEndDate?: number; // in ms
}
