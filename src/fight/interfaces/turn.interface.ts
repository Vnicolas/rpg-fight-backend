import { IResult } from "./results.interface";

/*
 * Will be used for type-checking and to determine the type
 * of values that will be received by the application
 */
export interface ITurn {
  dicesResults: IResult[];
  attackResults: IResult[];
  number: number;
  isLast: boolean;
}
