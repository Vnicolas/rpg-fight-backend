import { Character } from "src/character/entity/character.entity";

export interface IFighter {
  fighterByRank?: Character;
  ownerName?: string;
  error?: string;
}
