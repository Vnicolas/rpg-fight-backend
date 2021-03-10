import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";
import { CharacterDTO } from "../dto/character.dto";
import { ObjectID as MongoObjectID } from "mongodb";
import { CharacterStatus } from "../interfaces/character.interface";

@Entity("characters")
export class Character {
  // tslint:disable-next-line: variable-name
  @ObjectIdColumn() _id: ObjectID;
  @Column() picture: string;
  @Column() owner: MongoObjectID;
  @Column() name: string;
  @Column() skillPoints = 12;
  @Column() rank = 1;
  @Column() health = 10;
  @Column() attack = 0;
  @Column() defense = 0;
  @Column() magik = 0;
  @Column() fights: MongoObjectID[] = [];
  @Column() status: CharacterStatus = CharacterStatus.NOT_READY;
  @Column() restEndDate: Date;
  constructor(character?: CharacterDTO) {
    Object.assign(this, character);
  }
}
