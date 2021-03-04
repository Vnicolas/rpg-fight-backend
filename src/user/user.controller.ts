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
    if (!user) throw new NotFoundException('User does not exist !');
    const userDisplayable = this.getInfos(user);
    return res.status(HttpStatus.OK).json(userDisplayable);
  }

  // Add a user
  @Post()
  async addCustomer(@Res() res, @Body() UserDTO: UserDTO) {
    if (!UserDTO.name || !UserDTO.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Please fill all the fields, name or password missing`,
      });
    }

    this.userService.checkUser(UserDTO.name).then(async (user: User) => {
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `User with the name '${UserDTO.name}' already exists.`,
        });
      }
      const userToDisplay = await this.userService.addUser(UserDTO);
      const userDisplayable = this.getInfos(userToDisplay);
      return res.status(HttpStatus.OK).json(userDisplayable);
    });
  }

  // Signin a user
  @Post('/login')
  async signinUser(@Res() res, @Body() UserDTO: UserDTO) {
    const user = await this.userService.getUserWithCredentials(
      UserDTO.name,
      UserDTO.password,
    );
    if (!user) throw new NotFoundException('User does not exist !');
    const userDisplayable = this.getInfos(user);
    return res.status(HttpStatus.OK).json(userDisplayable);
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
