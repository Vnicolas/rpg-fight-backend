import { Entity, ObjectID, ObjectIdColumn, Column } from "typeorm";
import { ObjectID as MongoObjectID } from "mongodb";

@Entity("fights")
export class Fight {
  @ObjectIdColumn() id: ObjectID;
  @Column() turns = 0;
  @Column() winnerAttackValue: number;
  @Column() looserAttackValue: number;
  @Column() winnerHPSubstracted: number;
  @Column() looserHPSubstracted: number;
  @Column() winner: MongoObjectID;
  @Column() looser: MongoObjectID;
}
