import { Module } from "@nestjs/common";
import { CharacterController } from "./character.controller";
import { CharacterService } from "./character.service";
import { Character } from "./entity/character.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterModule {}
