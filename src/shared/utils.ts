import { Character } from "src/character/entity/character.entity";

export const objectIdCharactersNumber = 24;
export const maxCharactersAllowedPerUser = 10;
export function getClosestFighterByRank(
  fighterRank: number,
  fighterArray: Character[]
): Character {
  return fighterArray.reduce((a: Character, b: Character) => {
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
