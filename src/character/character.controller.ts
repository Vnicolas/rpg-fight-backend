import {
  Controller,
  Get,
  Res,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { Character } from './entity/character.entity';

@Controller('characters')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  // Retrieve characters list
  @Get()
  async getAllCharacter(@Res() res) {
    const characters: Character[] = await this.characterService.getAllCharacters();
    return res.status(HttpStatus.OK).json(characters);
  }

  // Fetch a particular character using ID
  @Get(':characterID')
  async getCustomer(@Res() res, @Param('characterID') characterID) {
    const character = await this.characterService.getCharacter(characterID);
    if (!character) throw new NotFoundException('Character does not exist !');
    const { id, ...characterDisplayable } = character;
    return res.status(HttpStatus.OK).json(characterDisplayable);
  }
}
