import { Server } from "bun";
import { WebSocketService } from "../websocket/websocket.service";
import { RenderPlayerData } from "../player/player.model";

class ServerServiceClass {

  server!: Server;

  constructor() {
  }

  init() {
    this.server = Bun.serve({
      port: process.env.API_PORT,
      fetch: (request: Request) => {
        const url = new URL(request.url);
        switch (url.pathname) {
          case '/get-online-players':
            return this.getOnlinePlayers();
          case '/authenticate':
            return this.authenticate(request);
        }
        return new Response("404");
      },
    });
    console.log('API Server started on port: ', process.env.API_PORT);
  }

  getOnlinePlayers(): Response {
    const livePlayers = WebSocketService.getRenderPlayersData();
    return this.getDataResponse<RenderPlayerData[]>(livePlayers);
  }

  authenticate(request: Request): Response {
    console.log(request.body);
    return this.getDataResponse({ playerData: null });
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