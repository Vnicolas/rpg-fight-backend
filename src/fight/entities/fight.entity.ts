import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BeforeInsert,
} from "typeorm";
import { ObjectID as MongoObjectID } from "mongodb";
import { FightDTO } from "../dto/fight.dto";
import { ITurn } from "../interfaces/turn.interface";

@Entity("fights")
export class Fight {
  // tslint:disable-next-line: variable-name
  @ObjectIdColumn() _id: ObjectID;
  @Column() turns: ITurn[] = [];
  @Column() winnerId: MongoObjectID;
  @Column() looserId: MongoObjectID;
  @Column() winnerName: string;
  @Column() looserName: string;
  @Column() winnerOwnerName: string;
  @Column() looserOwnerName: string;
  @Column() createdAt: Date;

  @BeforeInsert()
  async setDate(): Promise<void> {
    this.createdAt = new Date();
  }

  constructor(fight?: FightDTO) {
    Object.assign(this, fight);
  }
}
