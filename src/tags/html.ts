import { WireNode } from "../api/wire_node";
import { NodeFieldController } from "../interfaces/node_field_controller";

export class HTML extends WireNode {

    langController: NodeFieldController = {
        label: "lang",
        value: "",
    };

    classController: NodeFieldController = {
        label: "class",
        value: "",
    };

    constructor() {
        super();
        this.setupNode();

        this.createField(this.langController);
        this.createField(this.classController);
    }
}