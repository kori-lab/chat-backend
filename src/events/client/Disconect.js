"use strict";
import { WebSocketServer, WebSocket } from "ws";

export const name = "close";
/**
 * @param {WebSocketServer} server
 * @param {WebSocket} socket
 */
export async function execute(socket, server) {
  if (socket.username) {
    console.log(socket.username, "disconected");

    server.send_message(
      4,
      `${socket.username} disconected from the chat`,
      socket
    );
  }
}
