import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { CharacterDTO } from 'src/character/dto/character.dto';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';
import { CharacterService } from 'src/character/character.service';
import { compare as bcryptCompare } from 'bcrypt';
import { UserLoginDTO } from './dto/user.login.dto';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private characterService: CharacterService,
  ) {}

  // Retrieve users list
  @Get()
  async getAllUsers(@Res() res) {
    const users: User[] = await this.userService.getAllUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  // Fetch a particular user using ID
  @Get(':userID')
  async getCustomer(@Res() res, @Param('userID') userID: string) {
    const user: User = await this.userService.getUser(userID);
    if (!user)
      throw new NotFoundException(
        `User with the id ${userID} does not exist !`,
      );
    return res.status(HttpStatus.OK).json(user);
  }

  // Add a user
  @Post()
  async addCustomer(@Res() res, @Body() UserDTO: UserDTO) {
    if (!UserDTO.name || !UserDTO.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Please fill all the fields, name or password missing`,
      });
    }

    this.userService.getUserByName(UserDTO.name).then(async (user: User) => {
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `User with the name '${UserDTO.name}' already exists.`,
        });
      }
      const userToDisplay: User = await this.userService.addUser(UserDTO);
      return res.status(HttpStatus.OK).json(userToDisplay);
    });
  }

  // Signin a user
  @Post('/login')
  async signinUser(@Res() res, @Body() UserDTO: UserLoginDTO) {
    const user: User = await this.userService.getUserByName(UserDTO.name);
    if (!user) throw new NotFoundException('User does not exist !');
    const match = await bcryptCompare(UserDTO.password, user.password);
    if (match) {
      return res.status(HttpStatus.OK).json(user);
    }
    return res.status(HttpStatus.UNAUTHORIZED).json(user);
  }

  // Add a character to a user
  @Post(':userID/characters')
  async addCharacter(
    @Res() res,
    @Param('userID') userID: string,
    @Body() CharacterDTO: CharacterDTO,
  ) {
    const avatars = new Avatars(sprites);
    const picture = avatars.create(CharacterDTO.name);
    CharacterDTO.picture = picture;
    if (!CharacterDTO.name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Missing field name`,
      });
    }

    const characterToDisplay = await this.characterService.addCharacter(
      CharacterDTO,
    );
    await this.userService.addCharacterToUser(userID, characterToDisplay);
    return res.status(HttpStatus.OK).json(characterToDisplay);
  }
}
