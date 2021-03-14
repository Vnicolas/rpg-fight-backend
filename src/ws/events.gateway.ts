import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { CharacterService } from "src/character/character.service";
import {
  CharacterStatus,
  ICharacter,
} from "src/character/interfaces/character.interface";
import { FightService } from "src/fight/fight.service";
import { ITurn } from "src/fight/interfaces/turn.interface";
import { EventsService } from "./events.service";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private reponseDelay = 1500; // in ms
  private fights = {};

  constructor(
    private characterService: CharacterService,
    private eventsService: EventsService,
    private fightService: FightService
  ) {}

  @WebSocketServer() server;

  handleConnection(client: Socket): void {
    console.log("user connected to lobby");
    client.emit("connected");
  }

  handleDisconnect(client: Socket): void {
    delete this.fights[client.id];
    console.log("user left lobby " + client.id);
  }

  subscribeToFightEvents(
    client: Socket,
    fighter: ICharacter,
    opponent: ICharacter
  ): void {
    this.eventsService.gameEnded$.subscribe(async (gameEnded: boolean) => {
      if (gameEnded) {
        this.eventsService.stopFight(String(fighter._id));
        // Save fight
        if (!this.fights[client.id]) {
          return;
        }
        const fightResults = this.eventsService.getFightResults(
          this.fights[client.id].turns,
          fighter.ownerName,
          opponent.ownerName
        );

        const winnerIdString = String(fightResults.winnerId);
        let isWinner = false;
        let winner = opponent;
        if (winnerIdString === fighter._id) {
          winner = fighter;
          isWinner = true;
        }
        this.eventsService.updateCharacter(winner._id, winner, isWinner);
        this.eventsService.updateCharacter(opponent._id, opponent, !isWinner);
        const fightSaved = await this.fightService.addFight(fightResults);
        client.emit("end", fightSaved);
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
    client: Socket,
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
      const opponent: ICharacter = await this.eventsService.findOpponentByRank(
        clientFighter.rank,
        opponentsNotOwned
      );

      if (!this.fights[client.id]) {
        this.fights[client.id] = {
          turns: [],
        };
      }

      this.subscribeToFightEvents(client, clientFighter, opponent);
      setTimeout(() => {
        client.emit("opponent-found", opponent);
        this.eventsService.launchFight(clientFighter, opponent);
      }, this.reponseDelay);
    } catch (err) {
      console.error(err);
      client.emit("exception", err);
    }
  }

  @SubscribeMessage("exception")
  handleMessage(payload: any): string {
    throw new WsException(payload);
  }
}
