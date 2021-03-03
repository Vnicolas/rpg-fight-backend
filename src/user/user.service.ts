import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserDTO } from './dto/user.dto';

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
    const user = await this.userModel.findById(userID).exec();
    return user;
  }

  // Get a single user
  async getUserWithCredentials(name: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ name, password }).exec();
    return user;
  }

  // Check if a user exists
  async checkUser(name: string): Promise<User> {
    const user = await this.userModel.findOne({ name }).exec();
    return user;
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
  // Delete a user
  async deleteUser(userID: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndRemove(userID);
    return deletedUser;
  }
}
