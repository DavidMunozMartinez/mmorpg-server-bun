import { ServerWebSocket } from "bun";
import { PlayerClass } from "./players-handler";
import { handlePlayerEvents } from "./players-event-handler";

export enum WSEvents {
  PLAYER,
  CREATURE,
  ENVIRONMENT,
}

export type InputWSEvent = {
  eventType: number;
  subEventType: number;
  data: any;
}

export type PlayerLiveConnection = ServerWebSocket<{ playerId: string }>

export const connections = new Map<string, PlayerClass>();

export function initWebSocketService() {
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
      message: onMessage,
      open: onOpen,
    }
  })
}

/**
 * Recieve websockets from clients
 */
function onMessage(websocket: PlayerLiveConnection, message: string) {
  const event: InputWSEvent = JSON.parse(message);
  switch (event.eventType) {
    case WSEvents.PLAYER:
      handlePlayerEvents(event);
      break;
    case WSEvents.CREATURE:
      break;
    case WSEvents.ENVIRONMENT:
      break;
  }
}

/**
 * New Player connected to server
 */
function onOpen(websocket: PlayerLiveConnection) {
  if (websocket.data) {
    const player = new PlayerClass(websocket);
    connections.set(player.id, player);
    console.log('New player joined server', player.id);
  }
}