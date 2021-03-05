import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterDTO } from './dto/character.dto';
import { Character } from './interfaces/character.interface';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

@Controller('characters')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  private getInfos(character: Character): Partial<Character> {
    return {
      picture: character.picture,
      name: character.name,
      skillPoints: character.skillPoints,
      rank: character.rank,
      health: character.health,
      attack: character.attack,
      defense: character.defense,
      magik: character.magik,
      owner: character.owner,
      fights: character.fights,
    };
  }

  // Retrieve characters list
  @Get()
  async getAllCharacter(@Res() res) {
    let characters: Character[] = await this.characterService.getAllCharacters();
    const charactersDisplayable = characters.map((character) =>
      this.getInfos(character),
    );
    return res.status(HttpStatus.OK).json(charactersDisplayable);
  }

  // Fetch a particular character using ID
  @Get(':characterID')
  async getCustomer(@Res() res, @Param('characterID') characterID) {
    const character = await this.characterService.getCharacter(characterID);
    if (!character) throw new NotFoundException('Character does not exist !');
    const characterDisplayable = this.getInfos(character);
    return res.status(HttpStatus.OK).json(characterDisplayable);
  }

  // Add a character
  @Post()
  async addCharacter(@Res() res, @Body() CharacterDTO: CharacterDTO) {
    const avatars = new Avatars(sprites);
    const picture = avatars.create(CharacterDTO.name);
    CharacterDTO.picture = picture;
    if (!CharacterDTO.name || !CharacterDTO.owner) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Please fill all the fields, name or owner missing`,
      });
    }

    const characterToDisplay = await this.characterService.addCharacter(
      CharacterDTO,
    );
    const characterDisplayable = this.getInfos(characterToDisplay);
    return res.status(HttpStatus.OK).json(characterDisplayable);
  }
}
