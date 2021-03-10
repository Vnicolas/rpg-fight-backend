import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { CharacterService } from "src/character/character.service";
import { Character } from "src/character/entity/character.entity";
import {
  CharacterStatus,
  ICharacter,
} from "src/character/interfaces/character.interface";
import { getClosestFighterByRank } from "src/shared/utils";
import { UserService } from "src/user/user.service";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private characterService: CharacterService,
    private userService: UserService
  ) {}

  @WebSocketServer() server;

  handleConnection(client): void {
    console.log("user connected !");
    client.emit("connected");
  }

  handleDisconnect(): void {
    console.log("user disconnected !");
  }

  @SubscribeMessage("search-opponent")
  async handleEvent(
    client,
    message: { userId: string; fighter: Character }
  ): Promise<void> {
    client.emit("searching");
    try {
      const findOptions = {
        status: CharacterStatus.READY,
      };
      const opponents = await this.characterService.getAllCharacters(
        findOptions
      );
      const clientFighter = message.fighter;
      const opponentsNotOwned = opponents.filter((fighter: Character) => {
        return JSON.parse(JSON.stringify(fighter.owner)) !== message.userId;
      });
      const fighterByRank = getClosestFighterByRank(
        clientFighter.rank,
        opponentsNotOwned
      );
      const opponentOwner = await this.userService.getUser(
        JSON.parse(JSON.stringify(fighterByRank.owner))
      );
      const ownerName = opponentOwner.name;
      setTimeout(() => {
        client.emit("opponent-found", { fighterByRank, ownerName });
      }, 1500);
    } catch (err) {
      client.emit("error", err);
    }
  }
}
