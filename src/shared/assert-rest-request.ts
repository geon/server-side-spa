import { isPage, type Request } from "./types";

export function assertRestRequest(json: unknown): Request {
    if (!json) {
        throw new Error("No value.");
    }

    if (typeof json !== "object") {
        throw new Error("Not an object.");
    }

    if ("page" in json) {
        if (typeof json.page !== "string") {
            throw new Error("Page property is not a string.");
        }

        if (!isPage(json.page)) {
            throw new Error("Page property is not a Page.");
        }
    }

    return json as Request;
}
