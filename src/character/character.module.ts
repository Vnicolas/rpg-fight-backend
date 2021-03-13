import { Module } from "@nestjs/common";
import { CharacterController } from "./character.controller";
import { CharacterService } from "./character.service";
import { Character } from "./entity/character.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FightModule } from "src/fight/fight.module";

@Module({
  imports: [TypeOrmModule.forFeature([Character]), FightModule],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterModule {}
