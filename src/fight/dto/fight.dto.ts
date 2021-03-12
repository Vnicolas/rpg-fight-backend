import { ObjectID as MongoObjectID } from "mongodb";
import { ITurn } from "../interfaces/turn.interface";

export class FightDTO {
  winnerOwner: MongoObjectID;
  looserOwner: MongoObjectID;
  winner: MongoObjectID;
  looser: MongoObjectID;
  turns: ITurn[];
}
