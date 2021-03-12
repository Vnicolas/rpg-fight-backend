import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ITurn } from "src/fight/interfaces/turn.interface";
import { IResult } from "src/fight/interfaces/results.interface";
import { ObjectID as MongoObjectID } from "mongodb";
import {
  getClosestFighterByRank,
  randomIntFromInterval,
} from "src/shared/utils";
import { UserService } from "src/user/user.service";
import { IFighter } from "./interfaces/fighter.interface";
import { Subject } from "rxjs";
import { ICharacter } from "src/character/interfaces/character.interface";
import { IFight } from "src/fight/interfaces/fight.interface";
import { FightDTO } from "src/fight/dto/fight.dto";

@Injectable()
export class EventsService {
  public gameEnded$ = new Subject();
  public turnResults$ = new Subject<ITurn>();
  private turnNumber = 0;
  private fightIntervalTime = 3500; // in ms

  constructor(
    private userService: UserService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  async findOpponentByRank(
    fighterRank: number,
    opponents: ICharacter[]
  ): Promise<IFighter> {
    const fighterByRank = getClosestFighterByRank(fighterRank, opponents);
    const opponentOwner = await this.userService.getUser(
      String(fighterByRank.owner)
    );
    if (!opponentOwner) {
      return { error: "Opponent owner not found" };
    }
    const ownerName = opponentOwner.name;
    return { fighterByRank, ownerName };
  }

  isLastTurn(attackResults: IResult[]): boolean {
    const fighterHp = attackResults[1].opponentHpResult;
    const opponentHp = attackResults[0].opponentHpResult;
    return fighterHp <= 0 || opponentHp <= 0;
  }

  getDicesResults(fighter: ICharacter, opponent: ICharacter): IResult[] {
    // Each turn both characters launches a dice with as many faces as the
    // Attack's Skill Point amount, it's the Attack's value
    const diceResult = randomIntFromInterval(fighter.attack);
    const diceOpponentResult = randomIntFromInterval(opponent.attack);
    return [
      {
        characterName: fighter.name,
        result: diceResult,
      },
      {
        characterName: opponent.name,
        result: diceOpponentResult,
      },
    ];
  }

  getAttackResult(
    fighter: ICharacter,
    diceResult: number,
    opponent: ICharacter
  ): IResult {
    // In order to retrieve HP when fight ends
    opponent.baseHealth = opponent.baseHealth || opponent.health;
    let fighterAttackResult = 0;
    let magikPointsAdded = false;
    let opponentHpResult = opponent.health;
    // Attack's value are compared with Defense's Skill Point amount
    fighterAttackResult = diceResult - opponent.defense;
    // if the difference is positive => Attack succeed
    if (fighterAttackResult > 0) {
      // If the difference equals Magik's Skill Point amount, this value is added to the difference
      if (fighterAttackResult === fighter.magik) {
        fighterAttackResult = fighterAttackResult + fighter.magik;
        magikPointsAdded = true;
      }
      // When Attack succeed the difference is substracted from the opponent's Health Point
      opponentHpResult = opponent.health - fighterAttackResult;
      opponent.health = opponent.health - fighterAttackResult;
    } else {
      // if the difference is zero or negative => Attack failed
      fighterAttackResult = 0;
    }
    const fighterResult: IResult = {
      characterName: fighter.name,
      characterId: fighter._id,
      characterOwner: new MongoObjectID(String(fighter.owner)),
      result: fighterAttackResult,
      magikPointsAdded,
      opponentHpResult,
    };
    return fighterResult;
  }

  getAttackResults(
    fighter: ICharacter,
    opponent: ICharacter,
    diceResult: number,
    opponentDiceResult: number
  ): IResult[] {
    const fighterAttackResult = this.getAttackResult(
      fighter,
      diceResult,
      opponent
    );
    const opponentAttackResult = this.getAttackResult(
      opponent,
      opponentDiceResult,
      fighter
    );
    return [fighterAttackResult, opponentAttackResult];
  }

  getFightResults(turns: ITurn[]): FightDTO {
    const lastTurn = turns.find((turn: ITurn) => turn.isLast === true);
    const fighterResult = lastTurn.attackResults[0];
    const opponentResult = lastTurn.attackResults[1];
    let winnerOwner: MongoObjectID;
    let looserOwner: MongoObjectID;
    let winner: MongoObjectID;
    let looser: MongoObjectID;
    if (fighterResult.opponentHpResult <= 0) {
      winner = fighterResult.characterId;
      looser = opponentResult.characterId;
      winnerOwner = fighterResult.characterOwner;
      looserOwner = opponentResult.characterOwner;
    } else {
      winner = opponentResult.characterId;
      looser = fighterResult.characterId;
      winnerOwner = opponentResult.characterOwner;
      looserOwner = fighterResult.characterOwner;
    }
    const fightToSave: FightDTO = {
      winnerOwner,
      looserOwner,
      winner: new MongoObjectID(winner),
      looser: new MongoObjectID(looser),
      turns,
    };
    return fightToSave;
  }

  getTurnResults(clientFighter: ICharacter, opponent: ICharacter): void {
    const dicesResults = this.getDicesResults(clientFighter, opponent);
    const attackResults = this.getAttackResults(
      clientFighter,
      opponent,
      dicesResults[0].result,
      dicesResults[1].result
    );

    const isLast = this.isLastTurn(attackResults);
    this.turnResults$.next({
      dicesResults,
      attackResults,
      number: this.turnNumber,
      isLast,
    });
    this.gameEnded$.next(isLast);
  }

  launchFight(fighter: ICharacter, opponent: ICharacter): void {
    this.gameEnded$.next(false);
    this.turnNumber = 0;
    const fighterId = String(fighter._id);

    const interval = setInterval(() => {
      this.turnNumber++;
      this.getTurnResults(fighter, opponent);
    }, this.fightIntervalTime);

    const intervals = this.schedulerRegistry.getIntervals();
    if (intervals.includes(fighterId)) {
      this.schedulerRegistry.deleteInterval(fighterId);
    }

    this.schedulerRegistry.addInterval(fighterId, interval);
  }

  stopFight(fighterId: string): void {
    const intervals = this.schedulerRegistry.getIntervals();
    if (intervals.includes(fighterId)) {
      this.schedulerRegistry.deleteInterval(fighterId);
      // TODO: save fight ONLY IF it's terminated
    }
  }
}
