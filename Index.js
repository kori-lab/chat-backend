import Server from "./src/classes/Server.js";

const server = new Server({ port: 8080 });

await server.setEvents("server", server);


