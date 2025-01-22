export interface Request {
    page?: Page;
}

export interface Response {
    diff: string;
}

export const pages = ["home", "about-us", "faq"] as const;
export type Page = (typeof pages)[number];
export function isPage(page: string): page is Page {
    return pages.some((x) => x === page);
}
export function assertPage(page: string): Page {
    if (!isPage(page)) {
        throw new Error("Not a page: " + page);
    }
    return page;
}
