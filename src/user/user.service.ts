import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { Character } from 'src/character/entity/character.entity';
import { CharacterService } from 'src/character/character.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    private characterService: CharacterService,
  ) {}

  // Fetch all users
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  // Fetch a single user
  async getUser(userID: string): Promise<User> {
    const user = await this.usersRepository.findOne(userID);
    if (!user) {
      throw new NotFoundException('User does not exist !');
    }
    return await this.populateUser(user);
  }

  // Get a single user with name
  async getUserByName(name: string): Promise<User> {
    return await this.usersRepository.findOne({ name });
  }

  // Post a single user
  async addUser(userDTO: UserDTO): Promise<User> {
    return await this.usersRepository.save(new User(userDTO));
  }

  // Add a character to user
  async addCharacterToUser(user: User, character: Character): Promise<User> {
    // TODO: Check doubles in user.characters
    user.characters.push(character.id);
    await this.usersRepository.update(user.id, user);
    return await this.getUserByName(user.name);
  }

  async populateUser(user: User): Promise<User> {
    const userCharacters = await this.characterService.getCharacters(
      user.characters,
    );
    const userToDisplay = JSON.parse(JSON.stringify(user));
    userToDisplay.characters = userCharacters;
    return Promise.resolve(userToDisplay);
  }
}
