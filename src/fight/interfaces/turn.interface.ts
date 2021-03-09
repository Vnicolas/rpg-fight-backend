import { IResults, IResultsWS } from './results.interface';

export interface ITurn {
  dicesResults: IResults[] | IResultsWS[];
  attackResults: IResults[] | IResultsWS[];
  magikPointsAdded: IResults[] | IResultsWS[];
  hpResults: IResults[] | IResultsWS[];
  hpSubstractedResults: IResults[] | IResultsWS[];
  number: number;
  isLast: number;
}
