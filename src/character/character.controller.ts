import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  BadRequestException,
  Patch,
  Query,
  Body,
} from "@nestjs/common";
import { Fight } from "src/fight/entities/fight.entity";
import { FightService } from "src/fight/fight.service";
import { objectIdCharactersNumber } from "src/shared/utils";
import { CharacterService } from "./character.service";
import { CharacterDTO } from "./dto/character.dto";
import { Character } from "./entity/character.entity";
import { ObjectID as MongoObjectID } from "mongodb";

@Controller("characters")
export class CharacterController {
  constructor(
    private characterService: CharacterService,
    private fightService: FightService
  ) {}

  // Retrieve characters list
  @Get()
  async getAllCharacter(@Res() res, @Query() query): Promise<Character[]> {
    try {
      const options: any = {};
      if (
        query &&
        query.owner &&
        query.owner.length === objectIdCharactersNumber
      ) {
        options.owner = new MongoObjectID(query.owner);
      }
      const characters: Character[] = await this.characterService.getAllCharacters(
        options
      );
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
  ): Promise<Character> {
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
  ): Promise<Character> {
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

  // Fetch all fights for a character
  @Get(":characterId/fights")
  async getFight(
    @Res() res,
    @Param("characterId") characterId: string
  ): Promise<Fight[]> {
    if (characterId.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    try {
      const fights = await this.fightService.getAllFights(characterId);
      return res.status(HttpStatus.OK).json(fights);
    } catch (err) {
      throw err;
    }
  }
}
