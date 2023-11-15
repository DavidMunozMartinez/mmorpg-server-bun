import { PlayerLiveConnection } from "./websocket-handler";

export class PlayerClass {
  id: string;
  position: [number, number] = [-1, -1];
  socket: PlayerLiveConnection;

  constructor(socket: PlayerLiveConnection) {
    this.id = socket.data?.playerId
    this.socket = socket;
  }
}