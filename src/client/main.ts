import { DiffDOM } from "diff-dom";
import { assertPage, Page, Request, Response } from "../shared/types";

function getAppElement() {
    const appElement = document.querySelector<HTMLDivElement>("#app");
    if (!appElement) {
        throw new Error("No app element.");
    }
    return appElement;
}

function getAnchor(url: string) {
    return url.split("#")[1];
}

function setUpEventHandlers(webSocket: WebSocket) {
    for (const link of document.querySelectorAll<HTMLAnchorElement>("a")) {
        link.onclick = (event) => {
            const anchor = getAnchor(link.href);
            if (!anchor) {
                throw new Error("Missing anchor.");
            }
            loadPage(webSocket, assertPage(anchor));
            event.preventDefault();
        };
    }
}

async function loadPage(webSocket: WebSocket, page: Page | undefined) {
    const request: Request = { page: page };
    webSocket.send(JSON.stringify(request));
}

function main() {
    const appElement = getAppElement();
    const webSocket = new WebSocket(
        "ws://" + window.location.hostname + ":3030"
    );
    const diffDom = new DiffDOM();

    webSocket.onopen = function (_event) {
        loadPage(webSocket, undefined);
    };

    webSocket.onmessage = function (message) {
        const response: Response = JSON.parse(message.data);

        diffDom.apply(appElement, JSON.parse(response.diff));
        setUpEventHandlers(webSocket);
    };
}

main();
