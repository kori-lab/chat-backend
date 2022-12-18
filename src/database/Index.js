import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

var sockets = [];

export default class Database {
  constructor() {}

  sockets() {
    return sockets;
  }

  /**
   * @param {WebSocket} socket
   * @param {username} string
   */
  add_client(socket, username) {
    sockets = sockets.filter((s) => s.readyState == WebSocket.OPEN);

    const uuid = this.generate_uuid();

    socket.uuid = uuid;

    if (sockets.find((s) => s.username == username))
      return { error: `This name "${username}" is taken` };

    socket.username = username;

    sockets.push(socket);

    return {
      error: "",
    };
  }

  /**
   * @param {string} uuid
   */
  remove_client(uuid) {
    if (this.client(uuid)) {
      sockets.splice(
        sockets.findIndex((socket) => socket.uuid == uuid),
        1
      );

      return true;
    } else {
      return false;
    }
  }

  generate_uuid() {
    while (true) {
      const uuid = uuidv4();

      if (!this.client(uuid)) {
        return uuid;
      }
    }
  }

  /**
   * @param {string} uuid
   */
  client(uuid) {
    return sockets.find((socket) => socket.uuid == uuid);
  }
}
