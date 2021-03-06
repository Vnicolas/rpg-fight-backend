import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { Fight } from "./entities/fight.entity";
import { FightDTO } from "./dto/fight.dto";
import { ObjectID as MongoObjectID } from "mongodb";

@Injectable()
export class FightService {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: MongoRepository<Fight>
  ) {}

  // Fetch all fights
  async getAllFights(characterId: string): Promise<Fight[]> {
    const fights = await this.fightRepository.find({
      where: {
        $or: [
          {
            winnerId: new MongoObjectID(characterId),
          },
          {
            looserId: new MongoObjectID(characterId),
          },
        ],
      },
    });
    if (fights.length === 0) {
      throw new NotFoundException("No Fights exist fot this character");
    }
    return fights;
  }

  // Fetch a single fight
  async getFight(fightId: string): Promise<Fight> {
    const fight = await this.fightRepository.findOne(fightId);
    if (!fight) {
      throw new NotFoundException("Fight does not exist");
    }
    return fight;
  }

  // Post a single fight
  async addFight(fightDTO: FightDTO): Promise<Fight> {
    return await this.fightRepository.save(new Fight(fightDTO));
  }
}
