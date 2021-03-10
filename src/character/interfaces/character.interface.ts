import { Document } from "mongoose";
import { IFight } from "src/fight/interfaces/fight.interface";
import { IUser } from "src/user/interfaces/user.interface";

export enum CharacterStatus {
  NOT_READY = "Not Ready",
  READY = "Ready",
  IN_FIGHT = "In Fight",
  RESTING = "Resting",
}

export interface ICharacter extends Document {
  readonly picture: string;
  readonly owner: IUser;
  readonly name: string;
  readonly skillPoints: number;
  readonly rank: number;
  readonly health: number;
  readonly attack: number;
  readonly defense: number;
  readonly magik: number;
  readonly fights: IFight[];
  readonly status: CharacterStatus;
}
