import { DiffDOM } from "diff-dom";

export function diffPageContent(
    oldPageContent: string,
    newPageContent: string
) {
    return JSON.stringify(
        new DiffDOM().diff(
            `<div>${oldPageContent}</div>`,
            `<div>${newPageContent}</div>`
        )
    );
}
