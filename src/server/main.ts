import * as http from "http";
import { server as WebSocketServer } from "websocket";
import { assertRestRequest } from "../shared/assert-rest-request";
import { Response } from "../shared/types";
import { getInitialState, update } from "./state";
import { render } from "./view";
import { diffPageContent } from "./diff-page-content";

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

        const newPageContent = await render(state);
        const diff = diffPageContent(oldPageContent, newPageContent);
        oldPageContent = newPageContent;

        connection.sendUTF(JSON.stringify({ diff } satisfies Response));
    });
});
