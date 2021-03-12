import { ICharacter } from "src/character/interfaces/character.interface";

export interface IFighter {
  fighterByRank?: ICharacter;
  ownerName?: string;
  error?: string;
}
