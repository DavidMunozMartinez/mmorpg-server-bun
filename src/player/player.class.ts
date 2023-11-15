import { PlayerLiveConnection } from "../websocket/websocket.model";

export class PlayerClass {
  id: string;
  position: [number, number] = [-1, -1];
  socket: PlayerLiveConnection;

  constructor(socket: PlayerLiveConnection) {
    this.id = socket.data?.playerId
    this.socket = socket;
  }
}