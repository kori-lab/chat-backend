import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import ua from "ua-parser-js";

const { IResult } = ua;

var sockets = [];

export default class Database {
  constructor() {}

  sockets() {
    return sockets;
  }

  /**
   * @param {WebSocket} socket
   * @param {string} username
   * @param {IResult} user_agent
   */
  add_client(socket, username, user_agent, locaiton_info) {
    sockets = sockets.filter((s) => s.readyState == WebSocket.OPEN);

    const uuid = this.generate_uuid();

    socket.uuid = uuid;
    socket.user_agent = user_agent;
    socket.locaiton_info = locaiton_info;

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
