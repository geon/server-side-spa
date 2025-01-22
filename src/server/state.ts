import { Page, pages, Request } from "../shared/types";

export interface State {
    readonly page: Page;
    readonly requestCounter: number;
}

export function getInitialState(): State {
    return {
        page: pages[0],
        requestCounter: 0,
    };
}

export function update(state: State, request: Request): State {
    return {
        requestCounter: state.requestCounter + 1,
        page: request.page ?? state.page,
    };
}
