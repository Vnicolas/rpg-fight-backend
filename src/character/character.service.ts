import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Character } from './interfaces/character.interface';
import { CharacterDTO } from './dto/character.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel('Character') private readonly characterModel: Model<Character>,
    private userService: UserService,
  ) {}
  // fetch all characters
  async getAllCharacters(): Promise<Character[]> {
    return await this.characterModel.find().exec();
  }
  // Get a single character
  async getCharacter(characterID: string): Promise<Character> {
    return await this.characterModel.findById(characterID).exec();
  }

  // post a single character
  async addCharacter(CharacterDTO: CharacterDTO): Promise<Character> {
    const newCharacter = await this.characterModel.create(CharacterDTO);
    await this.userService.addCharacterToUser(
      CharacterDTO.owner,
      newCharacter.id,
    );
    return Promise.resolve(newCharacter);
  }

  // Edit character details
  async updateCharacter(
    characterID: string,
    character: Character,
  ): Promise<Character> {
    const updatedCharacter = await this.characterModel.findByIdAndUpdate(
      characterID,
      character,
      { new: true },
    );
    return updatedCharacter;
  }
}
