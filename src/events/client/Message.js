"use strict";
import { WebSocketServer, WebSocket } from "ws";

export const name = "message";
/**
 * @param {WebSocketServer} server
 * @param {WebSocket} socket
 */
export async function execute(socket, server, buffer, binary) {
  const message = buffer.toString();

  console.log("new message", socket.username);

  try {
    const { type, content } = JSON.parse(message);

    if (type == 1) {
      server.send_message(type, content, socket);
    }
  } catch (error) {
    console.log("error on receive a message", error);
  }
}
