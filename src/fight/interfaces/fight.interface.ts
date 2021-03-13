import { ITurn } from "./turn.interface";
import { ObjectID as MongoObjectID } from "mongodb";

/*
 * Will be used for type-checking and to determine the type
 * of values that will be received by the application
 */
export interface IFight {
  winnerId?: MongoObjectID;
  looserId?: MongoObjectID;
  winnerName?: string;
  looserName?: string;
  winnerOwnerName?: string;
  looserOwnerName?: string;
  turns: ITurn[];
}
