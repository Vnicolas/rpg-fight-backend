import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Param,
  BadRequestException,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTO } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { CharacterDTO } from "src/character/dto/character.dto";
import { CharacterService } from "src/character/character.service";
import { compare as bcryptCompare } from "bcrypt";
import { UserLoginDTO } from "./dto/user.login.dto";
import { objectIdCharactersNumber } from "src/shared/utils";
import { ICharacter } from "src/character/interfaces/character.interface";
import { maxCharactersAllowedPerUser } from "../shared/utils";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
    private characterService: CharacterService
  ) {}

  // Retrieve users list
  @Get()
  async getAllUsers(@Res() res): Promise<any> {
    try {
      const users: User[] = await this.userService.getAllUsers();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      throw err;
    }
  }

  // Fetch a particular user using ID
  @Get(":userId")
  async getUser(@Res() res, @Param("userId") userId: string): Promise<any> {
    if (userId.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    try {
      const user = await this.userService.getUser(userId);
      return res.status(HttpStatus.OK).json(user);
    } catch (err) {
      throw err;
    }
  }

  // Add a user
  @Post()
  async addUser(@Res() res, @Body() userDTO: UserDTO): Promise<any> {
    if (!userDTO.name || !userDTO.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Please fill all the fields, name or password missing`,
      });
    }

    try {
      const user: User = await this.userService.getUserByName(
        userDTO.name,
        true
      );
      if (user) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `User with the name '${userDTO.name}' already exists.`,
        });
      }
      const userToDisplay: User = await this.userService.addUser(userDTO);
      return res.status(HttpStatus.OK).json(userToDisplay);
    } catch (err) {
      throw err;
    }
  }

  // Signin a user
  @Post("/login")
  async signinUser(
    @Res() res,
    @Body() userLoginDTO: UserLoginDTO
  ): Promise<any> {
    try {
      const user: User = await this.userService.getUserByName(
        userLoginDTO.name
      );
      const match = await bcryptCompare(userLoginDTO.password, user.password);
      if (!match) {
        return res.status(HttpStatus.UNAUTHORIZED);
      }
      const userPopulated = await this.userService.populateUser(user as User);
      return res.status(HttpStatus.OK).json(userPopulated);
    } catch (err) {
      throw err;
    }
  }

  // Add a character to a user
  @Post(":userId/characters")
  async addCharacter(
    @Res() res,
    @Param("userId") userId: string,
    @Body() characterDTO: CharacterDTO
  ): Promise<any> {
    if (userId.length !== objectIdCharactersNumber) {
      throw new BadRequestException();
    }

    try {
      const user = (await this.userService.getUser(userId, false)) as User;
      const userPopulated = await this.userService.populateUser(user as User);
      const characterAlreadyExists = (userPopulated.characters as ICharacter[]).find(
        (character: ICharacter) => character.name === characterDTO.name
      );

      if (characterAlreadyExists) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Character with the name ${characterDTO.name} already exists for this user`,
        });
      }

      if (user.characters.length >= maxCharactersAllowedPerUser) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Max characters limit (${maxCharactersAllowedPerUser}) per user reached`,
        });
      }

      characterDTO.owner = user._id;
      const characterToDisplay = await this.characterService.addCharacter(
        characterDTO
      );
      this.userService.addCharacterToUser(user, characterToDisplay);
      return res.status(HttpStatus.OK).json(characterToDisplay);
    } catch (err) {
      throw err;
    }
  }

  // Delete a character to a user
  @Delete(":userId/characters/:characterId")
  async deleteCharacter(
    @Res() res,
    @Param("userId") userId: string,
    @Param("characterId") characterId: string
  ): Promise<any> {
    if (
      userId.length !== objectIdCharactersNumber ||
      characterId.length !== objectIdCharactersNumber
    ) {
      throw new BadRequestException();
    }

    try {
      const userToDisplay = await this.userService.deleteCharacterToUser(
        userId,
        characterId
      );
      return res.status(HttpStatus.OK).json(userToDisplay);
    } catch (err) {
      throw err;
    }
  }
}
