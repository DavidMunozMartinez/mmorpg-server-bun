import { PlayerClass } from "../player/player.class";
import { PLAYER_EVENTS } from "../player/player.model";
import { handleWSEvent } from "./websocket.handler";
import { InputWSEvent, PlayerLiveConnection, WSEvents } from "./websocket.model";

class WebSocketServiceClass {

  connections: Map<string, PlayerClass> = new Map<string, PlayerClass>()

  constructor() {}

  init() {
    Bun.serve({
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
      port: 8080,
      websocket: {
        message: this.onMessage.bind(this),
        open: this.onOpen.bind(this),
        close: this.onClose.bind(this),
      }
    })
  }

  add(player: PlayerClass) {
    this.connections.set(player.id, player);
    console.log('New player')
  }

  remove(playerId: string) {
    this.connections.delete(playerId);
  }

  notifyAll(event: InputWSEvent) {
    this.connections.forEach((player) => {
      player.socket.send(JSON.stringify(event));
    });
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