import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { UserModule } from "src/user/user.module";
import { EventsService } from "./events.service";
import { FightModule } from "src/fight/fight.module";

@Module({
  imports: [UserModule, FightModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
