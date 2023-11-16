import { Server } from "bun";
import { WebSocketService } from "../websocket/websocket.service";
import { RenderPlayerData } from "../player/player.model";

class ServerServiceClass {

  server!: Server;

  constructor() {
  }

  init() {
    this.server = Bun.serve({
      port: 3000,
      fetch: (request: Request) => {
        const url = new URL(request.url);
        switch (url.pathname) {
          case '/get-online-players':
            return this.getOnlinePlayers();
        }
        return new Response("404");
      },
    });
  }

  getOnlinePlayers(): Response {
    const livePlayers = WebSocketService.getRenderPlayersData();
    return this.getDataResponse<RenderPlayerData[]>(livePlayers);
  }

  private getDataResponse<T>(data: T): Response {
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-control-allow-origin": "*",
      }
    })
  }
}

export const ServerService = new ServerServiceClass();