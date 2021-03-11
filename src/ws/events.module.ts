import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { UserModule } from "src/user/user.module";
import { EventsService } from "./events.service";

@Module({
  imports: [UserModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
