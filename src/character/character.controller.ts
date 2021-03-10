import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  BadRequestException,
  Patch,
  Body,
} from "@nestjs/common";
import { objectIdCharactersNumber } from "src/shared/utils";
import { CharacterService } from "./character.service";
import { CharacterDTO } from "./dto/character.dto";
import { Character } from "./entity/character.entity";

@Controller("characters")
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  // Retrieve characters list
  @Get()
  async getAllCharacter(@Res() res): Promise<any> {
    try {
      const characters: Character[] = await this.characterService.getAllCharacters();
      return res.status(HttpStatus.OK).json(characters);
    } catch (err) {
      throw err;
    }
  }

  // Fetch a particular character using ID
  @Get(":characterId")
  async getCharacter(
    @Res() res,
    @Param("characterId") characterId: string
  ): Promise<any> {
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

  // Update a character
  @Patch(":characterId")
  async updateCharacter(
    @Res() res,
    @Param("characterId") characterId: string,
    @Body() characterDTO: CharacterDTO
  ): Promise<any> {
    if (characterId.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    try {
      const characterUpdated: Character = await this.characterService.updateCharacter(
        characterId,
        characterDTO
      );
      return res.status(HttpStatus.OK).json(characterUpdated);
    } catch (err) {
      throw err;
    }
  }
}
