import { platform } from "process";
import { InputWSEvent, connections } from "./websocket-handler"

export enum PLAYER_EVENTS {
  CONNECTED,
  DISCONNECTED,
  MOVED,
  UNALIVED,
}

export enum DIRECTIONS {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export type PlayerEventData = {
  type: PLAYER_EVENTS
  data: any
}

export function handlePlayerEvents(event: InputWSEvent) {
  // const data = event.data;
  console.log('Handled event: ', event);
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
  connections.forEach((player) => {
    player.socket.send(JSON.stringify(event));
  });
}

function sendToAllExcept(ids: string[], event: InputWSEvent) {
  connections.forEach((player) => {
    if (ids.indexOf(player.id) === -1) {
      player.socket.send(JSON.stringify(event));
    } 
  });
}