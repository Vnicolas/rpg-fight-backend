import { ICharacter } from "src/character/interfaces/character.interface";

export const objectIdCharactersNumber = 24;
export const maxCharactersAllowedPerUser = 10;
export function getClosestFighterByRank(
  fighterRank: number,
  fighterArray: ICharacter[]
): ICharacter {
  return fighterArray.reduce((a: ICharacter, b: ICharacter) => {
    const aDiff = Math.abs(a.rank - fighterRank);
    const bDiff = Math.abs(b.rank - fighterRank);

    if (aDiff === bDiff) {
      return a.rank > b.rank ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}

export function randomIntFromInterval(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export function getRestingEndDate(hours = 1): number {
  return new Date().getTime() + hours * 60 * 60 * 1000;
}
