import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CharacterDTO } from "./dto/character.dto";
import { Character } from "./entity/character.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectID as MongoObjectID } from "mongodb";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-bottts-sprites";
import { CharacterStatus } from "./interfaces/character.interface";

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: MongoRepository<Character>
  ) {}
  // Fetch all characters
  async getAllCharacters(options?: any): Promise<Character[]> {
    if (options) {
      return await this.characterRepository.find({ ...options });
    }
    return await this.characterRepository.find();
  }

  // Get a single character
  async getCharacter(characterID: string): Promise<Character> {
    const character = await this.characterRepository.findOne(characterID);
    if (!character) {
      throw new NotFoundException("Character does not exist");
    }
    return character;
  }

  // Get all character for a user
  async getCharacters(characterIDs: MongoObjectID[]): Promise<Character[]> {
    return await this.characterRepository.findByIds(characterIDs);
  }

  // Post a single character
  async addCharacter(characterDTO: CharacterDTO): Promise<Character> {
    const avatars = new Avatars(sprites);
    const picture = avatars.create(characterDTO.name);
    characterDTO.picture = picture;
    if (!characterDTO.name || !characterDTO.owner) {
      throw new BadRequestException();
    }
    const newCharacter = await this.characterRepository.save(
      new Character(characterDTO)
    );
    return Promise.resolve(newCharacter);
  }

  // Delete a single character
  async deleteCharacter(characterId: string): Promise<void> {
    await this.characterRepository.delete(characterId);
  }

  // Edit character details
  async updateCharacter(
    characterID: string,
    characterDTO: CharacterDTO
  ): Promise<Character> {
    const existingCharacter = await this.characterRepository.findOne(
      characterID
    );
    if (!existingCharacter) {
      throw new NotFoundException();
    }
    if (
      existingCharacter.status === CharacterStatus.NOT_READY &&
      characterDTO.attack > 0
    ) {
      characterDTO.status = CharacterStatus.READY;
    }
    const { fights, owner, ...character } = characterDTO;
    await this.characterRepository.update(characterID, character);
    return await this.characterRepository.findOne(characterID);
  }
}
