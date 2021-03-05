import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import { Character } from 'src/character/interfaces/character.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  // fetch all users
  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }
  // Get a single user
  async getUser(userID: string): Promise<User> {
    return await this.userModel
      .findById(userID)
      .populate({
        path: 'characters',
        select: '-_id -owner -__v',
      })
      .exec();
  }

  // Get a single user
  async getUserWithCredentials(name: string, password: string): Promise<User> {
    return await this.userModel
      .findOne({ name, password })
      .populate({
        path: 'characters',
        select: '-_id -owner -__v',
      })
      .exec();
  }

  // Check if a user exists
  async checkUser(name: string): Promise<User> {
    return await this.userModel.findOne({ name }).exec();
  }
  // post a single user
  async addUser(UserDTO: UserDTO): Promise<User> {
    const newUser = await this.userModel.create(UserDTO);
    return newUser.save();
  }
  // Edit user details
  async updateUser(userID: string, UserDTO: UserDTO): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userID,
      UserDTO,
      { new: true },
    );
    return updatedUser;
  }

  // Add character to user
  async addCharacterToUser(
    userID: ObjectId,
    characterId: ObjectId,
  ): Promise<User> {
    return this.userModel.findById(userID).then((user: User) => {
      user.characters.push(characterId);
      return user
        .save()
        .then((_user) => user.populate('characters').execPopulate());
    });
  }
}
