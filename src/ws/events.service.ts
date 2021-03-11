import { Injectable } from "@nestjs/common";
import { Character } from "src/character/entity/character.entity";
import { getClosestFighterByRank } from "src/shared/utils";
import { UserService } from "src/user/user.service";
import { IFighter } from "./interfaces/fighter.interface";

@Injectable()
export class EventsService {
  constructor(private userService: UserService) {}

  // Add a character to user
  async findOpponentByRank(
    fighterRank: number,
    opponents: Character[]
  ): Promise<IFighter> {
    const fighterByRank = getClosestFighterByRank(fighterRank, opponents);
    const opponentOwner = await this.userService.getUser(
      JSON.parse(JSON.stringify(fighterByRank.owner))
    );
    if (!opponentOwner) {
      return { error: "Opponent owner not found" };
    }
    const ownerName = opponentOwner.name;
    return { fighterByRank, ownerName };
  }
}
