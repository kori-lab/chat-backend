"use strict";
import { WebSocketServer, WebSocket } from "ws";

export const name = "connection";
/**
 * @param {WebSocketServer} server
 * @param {WebSocket} socket
 */
export async function execute(server, socket, request) {
  const username =
    request.headers["user-name"] ||
    new URLSearchParams(request.url).get("/?username") ||
    new URLSearchParams(request.url).get("/?name");

  console.log("new connection", username);

  const user_created = server.database.add_client(socket, username);

  await server.setEvents("client", socket);

  if (user_created.error) {
    socket.send(
      JSON.stringify({
        type: 0,
        content: `This name "${username}" is taken, use /name to change your name`,
        code: 0,
      })
    );
    socket.close();
  } else {
    // server.send_message();
  }
}
