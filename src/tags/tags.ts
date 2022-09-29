import { NodeFieldController } from "../api/node_field_controller";
import {
    CustomNodeElement,
    NodeBody,
    NodeField,
    NodeHeader,
    NodeScaffold,
} from "../api/widgets";
import { WireNode } from "../api/wire_node";
import { Vector2 } from "../interfaces/node";

export class HTML extends WireNode {
    public langController!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(){
        return {
            name : "HTML",
            documentation : "This node is used to create HTML elements",
        }
    }

    build() {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "HTML",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        value: "en",
                        label: "lang",
                        controller: (fieldController) => {
                            this.langController = fieldController;
                        },
                    }),
                    new CustomNodeElement({
                        elementName: "button",
                        innerHTML: "get data",
                    }),
                ],
            }),
        });
    }
}
export class Head extends WireNode {
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(){
        return {
            name : "Head",
            documentation : "This node is used to create HTML head elements",
        }
    }

    build() {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Head",
            }),
        });
    }
}

export class Input extends WireNode {
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(){
        return {
            name : "Input",
            documentation : "Its represents an input element",
        }
    }

    build() {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Input",
            }),
            body : new NodeBody({
                children : [
                    new NodeField({
                        label : "type",
                        value : "text",
                    }),
                ],
            }),
        });
    }
}
