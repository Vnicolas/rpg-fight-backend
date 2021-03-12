import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BeforeInsert,
} from "typeorm";
import { ObjectID as MongoObjectID } from "mongodb";
import { FightDTO } from "../dto/fight.dto";

@Entity("fights")
export class Fight {
  // tslint:disable-next-line: variable-name
  @ObjectIdColumn() _id: ObjectID;
  @Column() turns = 0;
  @Column() winnerAttackValue: number;
  @Column() looserAttackValue: number;
  @Column() winnerHPSubstracted: number;
  @Column() looserHPSubstracted: number;
  @Column() winner: MongoObjectID;
  @Column() looser: MongoObjectID;
  @Column() createdAt: Date;

  @BeforeInsert()
  async setDate(): Promise<void> {
    this.createdAt = new Date();
  }

  constructor(fight?: FightDTO) {
    Object.assign(this, fight);
  }
}
