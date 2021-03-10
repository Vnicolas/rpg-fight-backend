import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  users = 0;

  handleConnection(): void {
    // A client has connected
    this.users++;
    console.log("user connected !");

    // Notify connected clients of current users
    this.server.emit("searching");
  }

  handleDisconnect(): void {
    // A client has disconnected
    this.users--;
    console.log("user disconnected !");

    // Notify connected clients of current users
    // this.server.emit('users', this.users);
  }

  @SubscribeMessage("search-opponent")
  handleEvent(): void {
    this.server.emit("searching");
  }
}
