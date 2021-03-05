import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { ObjectID as MongoObjectID } from 'mongodb';

@Entity('users')
export class User {
  @ObjectIdColumn() id: ObjectID;

  @Column({ nullable: false }) name: string;

  @Column() password: string;

  @Column() characters: MongoObjectID[] = [];

  constructor(user?: UserDTO) {
    Object.assign(this, user);
  }

  toJSON() {
    delete this.password;
    return this;
  }
}
