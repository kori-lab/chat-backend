import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import ua from "ua-parser-js";

const { IResult } = ua;

var sockets = [];

export default class Database {
  constructor(...args) {}

  sockets() {
    sockets = sockets.filter((s) => s.readyState == WebSocket.OPEN);

    return sockets;
  }

  /**
   * @param {WebSocket} socket
   * @param {string} username
   * @param {IResult} user_agent
   */
  add_client(socket, username, user_agent, location_info) {
    this.sockets();

    const uuid = this.generate_uuid();

    socket.uuid = uuid;
    socket.user_agent = user_agent;
    socket.location_info = location_info;

    if (!username)
      return {
        error: `use \`/name\` to set your name`,
      };
    else if (username.length > 38 || username.length < 2)
      return {
        error: `your name must be more than **2** and less than **38** letters, use \`/name\` to set your name`,
      };
    else if (sockets.find((s) => s.username == username))
      return {
        error: `This name **${username}** is taken, use \`/name\` to change your name`,
      };

    socket.username = username;
    sockets.push(socket);

    return {
      error: "",
      uuid,
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
