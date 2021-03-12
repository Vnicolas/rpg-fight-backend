import { ObjectID as MongoObjectID } from "mongodb";

export interface IResult {
  characterName: string;
  result: number;
  characterOwner?: MongoObjectID;
  characterId?: MongoObjectID;
  magikPointsAdded?: boolean;
  opponentHpResult?: number;
}
