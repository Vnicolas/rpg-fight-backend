import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fight } from './entities/fight.entity';
import { Character } from 'src/character/entity/character.entity';
import { FightController } from './fight.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fight, Character])],
  controllers: [FightController],
  providers: [],
})
export class FightModule {}
