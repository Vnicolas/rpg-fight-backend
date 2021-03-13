import { ObjectID as MongoObjectID } from "mongodb";
import { ITurn } from "../interfaces/turn.interface";

export class FightDTO {
  winnerId: MongoObjectID;
  looserId: MongoObjectID;
  winnerName: string;
  looserName: string;
  winnerOwnerName: string;
  looserOwnerName: string;
  turns: ITurn[];
}
