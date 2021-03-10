import { IResults, IResultsWS } from "./results.interface";

/*
 * Will be used for type-checking and to determine the type
 * of values that will be received by the application
 */
export interface ITurn {
  dicesResults: IResults[] | IResultsWS[];
  attackResults: IResults[] | IResultsWS[];
  magikPointsAdded: IResults[] | IResultsWS[];
  hpResults: IResults[] | IResultsWS[];
  hpSubstractedResults: IResults[] | IResultsWS[];
  number: number;
  isLast: number;
}
