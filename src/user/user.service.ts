import { Injectable, NotFoundException } from "@nestjs/common";
import { UserDTO } from "./dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Character } from "src/character/entity/character.entity";
import { CharacterService } from "src/character/character.service";
import { IUser } from "./interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    private characterService: CharacterService
  ) {}

  // Fetch all users
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  // Fetch a single user
  async getUser(userId: string, populate = true): Promise<User | IUser> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException("User does not exist !");
    }
    if (populate) {
      return await this.populateUser(user);
    }
    return user;
  }

  // Get a single user with name
  async getUserByName(name: string, justCheck = false): Promise<User> {
    const user = await this.usersRepository.findOne({ name });
    if (!user && !justCheck) {
      throw new NotFoundException("User does not exist !");
    }
    return user;
  }

  // Post a single user
  async addUser(userDTO: UserDTO): Promise<User> {
    return await this.usersRepository.save(new User(userDTO));
  }

  // Add a character to user
  addCharacterToUser(user: User, character: Character): void {
    user.characters.push(character._id);
    this.usersRepository.update(user._id, user);
  }

  // Delete a character to user
  async deleteCharacterToUser(
    userId: string,
    characterId: string
  ): Promise<User> {
    const user = (await this.getUser(userId, false)) as User;
    const userCharacters = user.characters.map((id: ObjectId) => String(id));
    const characterIndex = userCharacters.indexOf(characterId);
    if (characterIndex < 0) {
      throw new NotFoundException("User don't have this Character");
    }
    const characterToDelete = await this.characterService.getCharacter(
      characterId
    );
    if (!characterToDelete) {
      throw new NotFoundException("Character does not exist");
    }

    user.characters.splice(characterIndex, 1);
    await this.characterService.deleteCharacter(characterId);
    await this.usersRepository.update(user._id, user);
    return (await this.getUser(userId)) as User;
  }

  // Retrieve all user's characters
  async populateUser(user: User): Promise<User | IUser> {
    const userCharacters = await this.characterService.getCharacters(
      user.characters
    );
    const userToDisplay = JSON.parse(JSON.stringify(user));
    userToDisplay.characters = userCharacters;
    return Promise.resolve(userToDisplay);
  }
}
