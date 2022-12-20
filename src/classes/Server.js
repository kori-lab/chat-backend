import WebSocket, { WebSocketServer } from "ws";
import { readdirSync } from "fs";
import Database from "../database/Index.js";

export default class Server extends WebSocketServer {
  constructor(...args) {
    super(...args);

    this.database = new Database();
  }

  send_message(type = 1, message, author, blockeds = []) {
    this.database.sockets().forEach((client) => {
      if (
        client.readyState == WebSocket.OPEN &&
        !blockeds.includes(client.uuid)
      ) {
        if (type == 1) {
          client.send(
            JSON.stringify({
              type,
              content: message,
              author: {
                agent: author.user_agent,
                name: author.username,
                location: author.location_info,
              },
              timestamp: Date.now(),
            })
          );
        } else if (type == 3 || type == 4) {
          client.send(
            JSON.stringify({
              type,
              content: message,
              author: {
                agent: author.user_agent,
                name: author.username,
                location: author.location_info,
              },
              total_users: this.database.sockets().length,
              timestamp: Date.now(),
            })
          );
        }
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
