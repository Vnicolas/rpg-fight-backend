import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { UserService } from 'src/user/user.service';
import { Character } from './entity/character.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Character, User])],
  controllers: [CharacterController],
  providers: [UserService, CharacterService],
})
export class CharacterModule {}
