import { Injectable, NotFoundException } from '@nestjs/common';
import { CharacterDTO } from './dto/character.dto';
import { Character } from './entity/character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID as MongoObjectID } from 'mongodb';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: MongoRepository<Character>,
  ) {}
  // fetch all characters
  async getAllCharacters(): Promise<Character[]> {
    return await this.characterRepository.find();
  }

  // Get a single character
  async getCharacter(characterID: string): Promise<Character> {
    return await this.characterRepository.findOne(characterID);
  }

  // Get all character for a user
  async getCharacters(characterIDs: MongoObjectID[]): Promise<Character[]> {
    return await this.characterRepository.findByIds(characterIDs);
  }

  // post a single character
  async addCharacter(CharacterDTO: CharacterDTO): Promise<Character> {
    const newCharacter = await this.characterRepository.save(
      new Character(CharacterDTO),
    );
    return Promise.resolve(newCharacter);
  }

  // Edit character details
  async updateCharacter(
    characterID: string,
    characterDTO: CharacterDTO,
  ): Promise<void> {
    const existingCharacter = await this.characterRepository.findOne(
      characterID,
    );
    if (!existingCharacter) {
      throw new NotFoundException();
    }
    const { fights, owner, ...character } = characterDTO;
    await this.characterRepository.update(characterID, character);
  }
}
