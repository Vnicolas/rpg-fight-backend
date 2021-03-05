import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterSchema } from './schemas/character.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Character', schema: CharacterSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [CharacterController],
  providers: [UserService, CharacterService],
})
export class CharacterModule {}
