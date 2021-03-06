import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { CharacterDTO } from '../dto/character.dto';
import { ObjectID as MongoObjectID } from 'mongodb';
import { CharacterStatus } from '../interfaces/character.interface';

@Entity('characters')
export class Character {
  @ObjectIdColumn() id: ObjectID;
  @Column() picture: string;
  @Column() owner: MongoObjectID;
  @Column() name: string;
  @Column() skillPoints: number = 12;
  @Column() rank: number = 1;
  @Column() health: number = 0;
  @Column() attack: number = 0;
  @Column() defense: number = 0;
  @Column() magik: number = 0;
  @Column() fights: MongoObjectID[] = [];
  @Column() status: CharacterStatus = CharacterStatus.AVAILABLE;
  constructor(character?: CharacterDTO) {
    Object.assign(this, character);
  }
}
