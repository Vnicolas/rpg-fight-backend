import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { CharacterService } from "src/character/character.service";
import {
  CharacterStatus,
  ICharacter,
} from "src/character/interfaces/character.interface";
import { ITurn } from "src/fight/interfaces/turn.interface";
import { EventsService } from "./events.service";
import { IFighter } from "./interfaces/fighter.interface";
import { IFight } from "../fight/interfaces/fight.interface";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private reponseDelay = 1500; // in ms
  private fights = {};

  constructor(
    private characterService: CharacterService,
    private eventsService: EventsService
  ) {}

  @WebSocketServer() server;

  handleConnection(client): void {
    console.log("user connected to lobby");
    client.emit("connected");
  }

  handleDisconnect(client): void {
    delete this.fights[client.id];
    console.log("user left lobby " + client.id);
  }

  subscribeToFightEvents(client, fighterId: string): void {
    this.eventsService.gameEnded$.subscribe((gameEnded: boolean) => {
      if (gameEnded) {
        this.eventsService.stopFight(fighterId);
      }
    });

    this.eventsService.turnResults$.subscribe((turnResults: ITurn) => {
      if (turnResults && this.fights[client.id]) {
        this.fights[client.id].turns.push(turnResults);
        client.emit("turn-results", turnResults);
      }
    });
  }

  @SubscribeMessage("search-opponent")
  async handleEvent(
    client,
    message: { userId: string; fighter: ICharacter }
  ): Promise<void> {
    client.emit("searching");
    this.eventsService.stopFight(String(message.fighter._id));
    try {
      const findOptions = {
        status: CharacterStatus.READY,
      };
      const opponents = await this.characterService.getAllCharacters(
        findOptions
      );
      const opponentsJson: ICharacter[] = JSON.parse(JSON.stringify(opponents));
      const clientFighter = message.fighter;
      const opponentsNotOwned = opponentsJson.filter((fighter: ICharacter) => {
        return String(fighter.owner) !== message.userId;
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

      if (!this.fights[client.id]) {
        this.fights[client.id] = {
          turns: [],
        };
      }

      this.subscribeToFightEvents(client, String(clientFighter._id));
      setTimeout(() => {
        client.emit("opponent-found", { fighterByRank, ownerName });
        this.eventsService.launchFight(clientFighter, fighterByRank);
      }, this.reponseDelay);
    } catch (err) {
      client.emit("error", err);
    }
  }
}
