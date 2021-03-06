import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Fight } from "./entities/fight.entity";
import { Character } from "src/character/entity/character.entity";
import { FightService } from "./fight.service";

@Module({
  imports: [TypeOrmModule.forFeature([Fight, Character])],
  providers: [FightService],
  exports: [FightService],
})
export class FightModule {}
