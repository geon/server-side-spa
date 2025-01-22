import { promises as fs } from "fs";
import { State } from "./state";
const __dirname = import.meta.dirname;

export async function render(state: State) {
    return (
        (
            await fs.readFile(`${__dirname}/../../pages/${state.page}.html`)
        ).toString("utf8") + `<p>Request Counter: ${state.requestCounter}</p>`
    );
}
