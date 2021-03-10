import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BeforeInsert,
} from "typeorm";
import { UserDTO } from "../dto/user.dto";
import { ObjectID as MongoObjectID } from "mongodb";
import { hash as bcryptHash } from "bcrypt";

@Entity("users")
export class User {
  // tslint:disable-next-line: variable-name
  @ObjectIdColumn() _id: ObjectID;
  @Column({ nullable: false }) name: string;
  @Column() password: string;
  @Column({ length: 10 }) characters: MongoObjectID[] = [];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcryptHash(
      this.password,
      Number(process.env.HASH_SALT)
    );
  }

  constructor(user?: UserDTO) {
    Object.assign(this, user);
  }

  toJSON(): User {
    delete this.password;
    return this;
  }
}
