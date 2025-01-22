import { assertPage, Page, Request, Response } from "../shared/types";

function getRootElement() {
    const rootElement = document.querySelector<HTMLDivElement>("#app");
    if (!rootElement) {
        throw new Error("No root element.");
    }
    return rootElement;
}

function getAnchor(url: string) {
    return url.split("#")[1];
}

function setUpEventHandlers(webSocket: WebSocket) {
    for (const link of document.querySelectorAll<HTMLAnchorElement>("a")) {
        link.addEventListener("click", (event) => {
            const anchor = getAnchor(link.href);
            if (!anchor) {
                throw new Error("Missing anchor.");
            }
            loadPage(webSocket, assertPage(anchor));
            event.preventDefault();
        });
    }
}

async function loadPage(webSocket: WebSocket, page: Page | undefined) {
    const request: Request = { page: page };
    webSocket.send(JSON.stringify(request));
}

function main() {
    const rootElement = getRootElement();
    const webSocket = new WebSocket(
        "ws://" + window.location.hostname + ":3030"
    );

    webSocket.onopen = function (_event) {
        loadPage(webSocket, undefined);
    };

    webSocket.onmessage = function (message) {
        const response: Response = JSON.parse(message.data);
        rootElement.innerHTML = response.pageContent;
        setUpEventHandlers(webSocket);
    };
}

main();
