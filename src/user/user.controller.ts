import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  NotFoundException,
  Param,
  BadRequestException,
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
import { objectIdCharactersNumber } from 'src/shared/utils';
import { ICharacter } from 'src/character/interfaces/character.interface';
import { maxCharactersAllowedPerUser } from '../shared/utils';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private characterService: CharacterService,
  ) {}

  // Retrieve users list
  @Get()
  async getAllUsers(@Res() res) {
    try {
      const users: User[] = await this.userService.getAllUsers();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      throw err;
    }
  }

  // Fetch a particular user using ID
  @Get(':userID')
  async getUser(@Res() res, @Param('userID') userID: string) {
    if (userID.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    return this.userService
      .getUser(userID)
      .then((user: User) => {
        return res.status(HttpStatus.OK).json(user);
      })
      .catch((error: any) => {
        throw error;
      });
  }

  // Add a user
  @Post()
  async addUser(@Res() res, @Body() UserDTO: UserDTO) {
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
      const userPopulated = await this.userService.populateUser(user as User);
      return res.status(HttpStatus.OK).json(userPopulated);
    }
    return res.status(HttpStatus.UNAUTHORIZED);
  }

  // Add a character to a user
  @Post(':userID/characters')
  async addCharacter(
    @Res() res,
    @Param('userID') userID: string,
    @Body() CharacterDTO: CharacterDTO,
  ) {
    if (userID.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    try {
      const user = (await this.userService.getUser(userID, false)) as User;
      const userPopulated = await this.userService.populateUser(user as User);
      const characterAlreadyExists = (userPopulated.characters as ICharacter[]).find(
        (character: ICharacter) => character.name === CharacterDTO.name,
      );

      if (characterAlreadyExists) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Character with the name ${CharacterDTO.name} already exists for this user`,
        });
      }

      if (user.characters.length >= maxCharactersAllowedPerUser) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Max characters limit (${maxCharactersAllowedPerUser}) per user reached`,
        });
      }

      const avatars = new Avatars(sprites);
      const picture = avatars.create(CharacterDTO.name);
      CharacterDTO.picture = picture;
      CharacterDTO.owner = user.id;
      if (!CharacterDTO.name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Missing field name`,
        });
      }

      const characterToDisplay = await this.characterService.addCharacter(
        CharacterDTO,
      );
      await this.userService.addCharacterToUser(user, characterToDisplay);
      return res.status(HttpStatus.OK).json(characterToDisplay);
    } catch (err) {
      throw err;
    }
  }
}
