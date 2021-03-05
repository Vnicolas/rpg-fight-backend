import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CharacterService } from 'src/character/character.service';
import { Character } from 'src/character/entity/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Character])],
  controllers: [UserController],
  providers: [UserService, CharacterService],
})
export class UserModule {}
