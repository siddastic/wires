import { NodeFieldController } from "../api/node_field_controller";
import {
    CustomNodeElement,
    NodeBody,
    NodeButton,
    NodeField,
    NodeHeader,
    NodeScaffold,
    Widget,
} from "../api/widgets";
import { WireNode } from "../api/wire_node";
import { Vector2 } from "../interfaces/node";

export class HTML extends WireNode {
    public langController!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc() {
        return {
            name: "HTML",
            documentation: "This node is used to create HTML elements",
        };
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
                    new NodeButton({
                        label: "Create",
                        onClick: () => {
                            console.log(this.langController.value);
                        },
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

    static doc() {
        return {
            name: "Head",
            documentation: "This node is used to create HTML head elements",
        };
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

    static doc() {
        return {
            name: "Input",
            documentation: "Its represents an input element",
        };
    }

    build() {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Input",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        label: "type",
                        value: "text",
                    }),
                ],
            }),
        });
    }
}

export class AddNode extends WireNode {
    number1Controller!: NodeFieldController;
    number2Controller!: NodeFieldController;
    result?: number;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc() {
        return {
            name: "Add Node",
            documentation:
                "This node is an experiment node used to add two numbers",
        };
    }

    build(): Widget {
        const br = // for one empty line
            new CustomNodeElement({
                elementName: "div",
                innerHTML: "&nbsp;",
            });
        var children: Array<Widget> = [
            new NodeField({
                label: "number 1",
                value: this.number1Controller?.value ?? "0",
                type: "number",
                controller: (fieldController) => {
                    this.number1Controller = fieldController;
                },
            }),
            new NodeField({
                label: "number 2",
                value: this.number2Controller?.value ?? "0",
                type: "number",
                controller: (fieldController) => {
                    this.number2Controller = fieldController;
                },
            }),
            br,
            new NodeButton({
                label: "Add",
                onClick: () => {
                    this.result =
                        Number(this.number1Controller.value) +
                        Number(this.number2Controller.value);
                    this.rebuild();
                },
            }),
        ];
        if (this.result != undefined) {
            children.splice(
                2,
                0,
                new NodeField({
                    label: "result",
                    value: this.result?.toString() ?? "0",
                    type: "number",
                })
            );
            children.splice(
                children.length,
                0,
                ...[
                    br,
                    new NodeButton({
                        label: "Clear result",
                        onClick: () => {
                            this.result = undefined;
                            this.rebuild();
                        },
                    }),
                ]
            );
        }
        var scaffold = new NodeScaffold({
            header: new NodeHeader({
                title: "Add Node",
            }),
            body: new NodeBody({
                children: children,
            }),
        });
        return scaffold;
    }
}
