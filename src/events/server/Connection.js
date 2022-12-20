"use strict";
import { WebSocketServer, WebSocket } from "ws";
import UAParser from "ua-parser-js";
import IPLookup from "../../utils/IPLookup.js";
import CountryFlag from "../../utils/CountryFlag.js";

export const name = "connection";
/**
 * @param {WebSocketServer} server
 * @param {WebSocket} socket
 */
export async function execute(server, socket, request) {
  const username = String(
    request.headers["user-name"] ||
      new URLSearchParams(request.url).get("/?username") ||
      new URLSearchParams(request.url).get("/?name")
  ).trim();

  const user_ip = await IPLookup(
    request.headers["x-forwarded-for"] || request.socket.remoteAddress
  );
  
  const location_info = {
    region: user_ip.region,
    country: {
      name: user_ip.country,
      code: user_ip.countryCode,
      flag: CountryFlag(user_ip.countryCode),
    },
  };
  
  const user_agent = new UAParser(request.headers["user-agent"]).getResult();
  const user_created = server.database.add_client(
    socket,
    username,
    user_agent,
    location_info
  );

  console.log(
    "new connection",
    username,
    location_info,
    user_agent
  );

  await server.setEvents("client", socket);

  if (user_created.error) {
    socket.send(
      JSON.stringify({
        type: 0,
        content: user_created.error,
        code: 0,
        timestamp: Date.now(),
      })
    );
    socket.close();
  } else {
    server.send_message(
      3,
      `${username} joined in the chat`,
      server.database.client(user_created.uuid),
      [user_created.uuid]
    );

    socket.send(
      JSON.stringify({
        type: 0,
        content: `**${username}** welcome to the chat`,
        code: 3,
        timestamp: Date.now(),
      })
    );
  }
}
