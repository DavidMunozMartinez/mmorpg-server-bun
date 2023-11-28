
import { ServerService } from "./src/api/server.service";
import { initDBConnections } from "./src/db.handler";
import { WebSocketService } from "./src/websocket/websocket.service";

function init() {
  WebSocketService.init();
  ServerService.init();

  initDBConnections();
}

init();
