import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  private getInfos(user: User): Partial<UserDTO> {
    return {
      name: user.name,
      characters: user.characters,
    };
  }

  // Retrieve users list
  @Get()
  async getAllUsers(@Res() res) {
    let users: User[] = await this.userService.getAllUsers();
    const usersDisplayable: Partial<UserDTO>[] = users.map((user) =>
      this.getInfos(user),
    );
    return res.status(HttpStatus.OK).json(usersDisplayable);
  }

  // Fetch a particular user using ID
  @Get(':userID')
  async getCustomer(@Res() res, @Param('userID') userID) {
    const user = await this.userService.getUser(userID);
    const userDisplayable = this.getInfos(user);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(userDisplayable);
  }

  // add a user
  @Post()
  async addCustomer(@Res() res, @Body() UserDTO: UserDTO) {
    this.userService
      .checkUser(UserDTO.name)
      .then(async (userAlreadyExists: boolean) => {
        if (userAlreadyExists) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: `User with the name '${UserDTO.name}' already exists`,
          });
        }
        const user = await this.userService.addUser(UserDTO);
        const userDisplayable = this.getInfos(user);
        return res.status(HttpStatus.OK).json(userDisplayable);
      });
  }

  // Update a user's details
  // @Put(':userID')
  // async updateCustomer(
  //   @Res() res,
  //   @Param('userID') userID,
  //   @Body() UserDTO: UserDTO,
  // ) {
  //   const user = await this.userService.updateUser(userID, UserDTO);
  //   if (!user) throw new NotFoundException('User does not exist!');
  //   return res.status(HttpStatus.OK).json({
  //     message: 'User has been successfully updated',
  //     user,
  //   });
  // }
}
