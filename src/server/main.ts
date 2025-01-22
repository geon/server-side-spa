import * as http from "http";
import { promises as fs } from "fs";
import { server as WebSocketServer } from "websocket";
import { assertRestRequest } from "../shared/assert-rest-request";
import { pages, type Response } from "../shared/types";
const __dirname = import.meta.dirname;

// Serve the client static file.
const httpServer = http.createServer((_request, _response) => {
    // fs.createReadStream('client.html').pipe(response)
});
httpServer.listen(3030);

// Set up the WS server.
const wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: true,
});
wsServer.on("connect", (connection) => {
    let requestCounter = 0;
    connection.on("message", async (message) => {
        ++requestCounter;

        if (message.type !== "utf8") {
            throw new Error("Bad message type.");
        }

        const request = assertRestRequest(JSON.parse(message.utf8Data));

        const pageBuffer = await fs.readFile(
            `${__dirname}/../../pages/${request.page ?? pages[0]}.html`
        );
        const pageContent =
            pageBuffer.toString("utf8") +
            `<p>Request Counter: ${requestCounter}</p>`;

        const response: Response = {
            pageContent,
        };

        connection.sendUTF(JSON.stringify(response));
    });
});
