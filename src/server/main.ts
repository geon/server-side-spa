import * as http from "http";
import { promises as fs } from "fs";
import { server as WebSocketServer } from "websocket";
import { assertRestRequest } from "../shared/assert-rest-request";
import { Response } from "../shared/types";
import { DiffDOM } from "diff-dom";
import { getInitialState, update } from "./state";
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
    let state = getInitialState();
    let oldPageContent = "";
    connection.on("message", async (message) => {
        if (message.type !== "utf8") {
            throw new Error("Bad message type.");
        }
        const request = assertRestRequest(JSON.parse(message.utf8Data));

        state = update(state, request);

        let newPageContent =
            (
                await fs.readFile(`${__dirname}/../../pages/${state.page}.html`)
            ).toString("utf8") +
            `<p>Request Counter: ${state.requestCounter}</p>`;

        const diff = JSON.stringify(
            new DiffDOM().diff(
                `<div>${oldPageContent}</div>`,
                `<div>${newPageContent}</div>`
            )
        );

        const response: Response = {
            diff,
        };

        connection.sendUTF(JSON.stringify(response));
        oldPageContent = newPageContent;
    });
});
