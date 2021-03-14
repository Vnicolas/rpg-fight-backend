import { Document } from "mongoose";
import { IFight } from "src/fight/interfaces/fight.interface";
import { User } from "src/user/entities/user.entity";
import { IUser } from "src/user/interfaces/user.interface";

export enum CharacterStatus {
  NOT_READY = "Not Ready",
  READY = "Ready",
  IN_FIGHT = "In Fight",
  RESTING = "Resting",
}

export interface ICharacter extends Document {
  readonly _id: string;
  readonly picture: string;
  owner: IUser | User | string;
  ownerName?: string;
  health: number;
  baseHealth: number;
  fights: IFight[];
  rank: number;
  readonly name: string;
  readonly skillPoints: number;
  readonly attack: number;
  readonly defense: number;
  readonly magik: number;
  readonly status: CharacterStatus;
}
