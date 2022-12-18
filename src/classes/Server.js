import WebSocket, { WebSocketServer } from "ws";
import { readdirSync } from "fs";
import Database from "../database/Index.js";

export default class Server extends WebSocketServer {
  constructor(...args) {
    super(...args);

    this.database = new Database();
  }

  send_message(type, message, author) {
    this.database.sockets().forEach((client) => {
      if (client.readyState == WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type,
            content: message,
            author: author.username,
            timestamp: Date.now(),
          })
        );
      }
    });
  }

  async setEvents(type, receiver) {
    console.log("setting events", type);

    const path = `./src/events/${type}`;
    const event_files = readdirSync(path);

    for (const event_file of event_files) {
      const { name, execute } = await import(`../events/${type}/${event_file}`);

      console.log(`${path}/${event_file}`, name, execute);

      if (type == "client") {
        receiver.on(name, (...args) => execute(receiver, this, ...args));
      } else {
        receiver.on(name, (...args) => execute(this, ...args));
      }
    }
  }
}
