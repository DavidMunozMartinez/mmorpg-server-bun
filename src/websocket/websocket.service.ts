import { Server } from "bun";
import { PlayerClass } from "../player/player.class";
import { PLAYER_EVENTS, RenderPlayerData } from "../player/player.model";
import { handleWSEvent } from "./websocket.handler";
import { InputWSEvent, PlayerLiveConnection, WSEvents } from "./websocket.model";

class WebSocketServiceClass {

  livePlayers: Map<string, PlayerClass> = new Map<string, PlayerClass>();
  webSocketServer!: Server;

  constructor() {}

  init() {
    this.webSocketServer = Bun.serve({
      fetch(req, server) {
        const url = new URL(req.url);
        const playerId = url.searchParams.get('userId');
        if (url.pathname === '/ws') {
          const success = server.upgrade(req, {
            data: {
              playerId,
            }
          });
          if (success) {
            return new Response("WS Ok!");
          } else {
            return new Response('Failed to connect to WS', { status: 500 });
          }
        }
        return new Response("Ok!");
      },
      port: process.env.WS_PORT,
      websocket: {
        message: this.onMessage.bind(this),
        open: this.onOpen.bind(this),
        close: this.onClose.bind(this),
      }
    });
    console.log('WS Server started in port: ', process.env.WS_PORT)
  }

  add(player: PlayerClass) {
    this.livePlayers.set(player.id, player);
    console.log('New player, total: ', this.livePlayers.values.length);
  }

  remove(playerId: string) {
    this.livePlayers.delete(playerId);
    console.log('Removed player, total: ', this.livePlayers.values.length);
  }

  notifyAll(event: InputWSEvent) {
    this.livePlayers.forEach((player) => {
      player.socket.send(JSON.stringify(event));
    });
  }

  /**
   * Specifically returns just the necessary data so the UI can render the player
   */
  getRenderPlayersData(): RenderPlayerData[] {
    const players: RenderPlayerData[] = [];
    this.livePlayers.forEach((player: PlayerClass) => {
      players.push({
        id: player.id,
        position: player.position,
        name: player.name,
        health: player.health,
      })
    });
    return players;
  }

  private onMessage(webSocket: PlayerLiveConnection, message: string) {
    const webSocketEvent: InputWSEvent = JSON.parse(message);
    handleWSEvent(webSocketEvent);
  }

  private onOpen(webSocket: PlayerLiveConnection) {
    if (webSocket.data) {
      const player = new PlayerClass(webSocket);
      this.add(player);
    }
  }

  private onClose(webSocket: PlayerLiveConnection) {
    const playerId = webSocket.data.playerId;
    const event: InputWSEvent = {
      eventType: WSEvents.PLAYER,
      subEventType: PLAYER_EVENTS.DISCONNECTED,
      data: { applyTo: playerId }
    } 
    this.remove(playerId);
    this.notifyAll(event);
  }
}

export const WebSocketService = new WebSocketServiceClass();