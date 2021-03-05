import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { Character } from 'src/character/entity/character.entity';
import { CharacterService } from 'src/character/character.service';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    private characterService: CharacterService,
  ) {}
  // fetch all users
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  // Get a single user
  async getUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    const userCharacters = await this.characterService.getCharacters(
      user.characters,
    );
    const userToDisplay = JSON.parse(JSON.stringify(user));
    userToDisplay.characters = userCharacters;
    return Promise.resolve(userToDisplay);
  }

  // Get a single user
  async getUserByName(name: string): Promise<User> {
    return await this.usersRepository.findOne({ name });
  }

  // post a single user
  async addUser(userDTO: UserDTO): Promise<User> {
    if (!userDTO || !userDTO.name || !userDTO.password) {
      throw new BadRequestException(
        'A user must have at least name and password defined',
      );
    }
    return await this.usersRepository.save(new User(userDTO));
  }
  // Edit user details
  async updateUser(userID: string, userDTO: UserDTO): Promise<void> {
    // Check if entity exists
    const existingUser = await this.usersRepository.findOne(userID);
    if (!existingUser) {
      throw new NotFoundException();
    }
    const { characters, ...user } = userDTO;
    await this.usersRepository.update(userID, user);
  }

  // Add character to user
  async addCharacterToUser(
    userID: string,
    character: Character,
  ): Promise<void> {
    const user: User = await this.usersRepository.findOne(userID);
    user.characters.push(character.id);
    await this.usersRepository.update(userID, user);
  }
}
