import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { CharacterService } from "src/character/character.service";
import { Character } from "src/character/entity/character.entity";
import { CharacterStatus } from "src/character/interfaces/character.interface";
import { randomIntFromInterval } from "src/shared/utils";
import { EventsService } from "./events.service";
import { IFighter } from "./interfaces/fighter.interface";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private reponseDelay = 1500; // in ms

  constructor(
    private characterService: CharacterService,
    private eventsService: EventsService
  ) {}

  @WebSocketServer() server;

  handleConnection(client): void {
    console.log("user connected to lobby");
    client.emit("connected");
  }

  handleDisconnect(): void {
    console.log("user left lobby");
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
      const opponentAndOwner: IFighter = await this.eventsService.findOpponentByRank(
        clientFighter.rank,
        opponentsNotOwned
      );
      if (opponentAndOwner.error) {
        return client.emit("error", opponentAndOwner.error);
      }
      const fighterByRank = opponentAndOwner.fighterByRank;
      const ownerName = opponentAndOwner.ownerName;
      setTimeout(() => {
        client.emit("opponent-found", { fighterByRank, ownerName });
      }, this.reponseDelay);
      // TODO: Compute in service (interval), use TurnInterface
      setTimeout(() => {
        const diceResult = randomIntFromInterval(clientFighter.attack);
        const diceOpponentResult = randomIntFromInterval(fighterByRank.attack);
        client.emit("dice-result", { diceResult, diceOpponentResult });
      }, this.reponseDelay + 500);
    } catch (err) {
      client.emit("error", err);
    }
  }
}
