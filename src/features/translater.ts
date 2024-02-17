import { TextEncoder, TextDecoder } from "util";
import { Page } from "../components/page";

export function translate(input: Uint8Array) {
    let schema:string = new TextDecoder().decode(input);
    let output:string = new Page(schema).toString();
    return new TextEncoder().encode(output);
}

