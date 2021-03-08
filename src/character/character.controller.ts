import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { objectIdCharactersNumber } from 'src/shared/utils';
import { CharacterService } from './character.service';
import { Character } from './entity/character.entity';

@Controller('characters')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  // Retrieve characters list
  @Get()
  async getAllCharacter(@Res() res) {
    try {
      const characters: Character[] = await this.characterService.getAllCharacters();
      return res.status(HttpStatus.OK).json(characters);
    } catch (err) {
      throw err;
    }
  }

  // Fetch a particular character using ID
  @Get(':characterId')
  async getCustomer(@Res() res, @Param('characterId') characterId: string) {
    if (characterId.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    try {
      const character = await this.characterService.getCharacter(characterId);
      return res.status(HttpStatus.OK).json(character);
    } catch (err) {
      throw err;
    }
  }
}
