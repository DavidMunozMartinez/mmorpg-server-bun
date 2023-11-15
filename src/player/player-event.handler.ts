import { PLAYER_EVENTS } from "./player.model";
import { InputWSEvent } from "../websocket/websocket.model";
import { WebSocketService } from "../websocket/websocket.service";

export function handlePlayerEvents(event: InputWSEvent) {
  switch (event.subEventType) {
    case PLAYER_EVENTS.MOVED:
      sendToAll(event);
      break;
    case PLAYER_EVENTS.CONNECTED:
      sendToAllExcept(event.data.applyTo, event);
      break;
    case PLAYER_EVENTS.DISCONNECTED:
      sendToAllExcept(event.data.applyTo, event);
      break;
  }
}

function sendToAll(event: InputWSEvent) {
  WebSocketService.connections.forEach((player) => {
    player.socket.send(JSON.stringify(event));
  });
}

function sendToAllExcept(ids: string[], event: InputWSEvent) {
  WebSocketService.connections.forEach((player) => {
    if (ids.indexOf(player.id) === -1) {
      player.socket.send(JSON.stringify(event));
    } 
  });
}
