
import { ServerService } from "./src/api/server.service";
import { WebSocketService } from "./src/websocket/websocket.service";

function init() {
  WebSocketService.init();
  ServerService.init();
}

init();
