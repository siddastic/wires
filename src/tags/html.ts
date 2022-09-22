import { WireNode } from "../api/wire_node";

export class HTML extends WireNode {

    // langController: NodeField<string> = {
    //     label: "lang",
    //     value: "en",
    // };

    constructor() {
        super();
        this.setupNode();

        this.createField("lang");
        this.createField("class");
    }
}