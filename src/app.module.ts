import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { CharacterModule } from "./character/character.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsModule } from "./ws/events.module";
import { ScheduleModule } from "@nestjs/schedule";
require("dotenv").config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/`;
const DB_NAME = process.env.DB_NAME;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: MONGO_URL,
      database: DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    UserModule,
    CharacterModule,
    EventsModule,
  ],
})
export class AppModule {}
