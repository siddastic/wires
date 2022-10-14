import { NodeFieldController } from "../api/node_field_controller";
import {
    CustomNodeElement,
    NodeBody,
    NodeButton,
    NodeField,
    NodeFooter,
    NodeHeader,
    NodeScaffold,
    Widget,
} from "../api/widgets";
import { WireNode } from "../api/wire_node";
import { NodeData, Vector2 } from "../interfaces/node";

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

export class SubtractNode extends WireNode {
    numberA!: NodeFieldController;
    numberB!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(): NodeData {
        return {
            name: "Subtract Node",
            documentation:
                "This node is an experiment node used to subtract two numbers",
        };
    }

    build(): Widget {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Subtract Node",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        value: 0,
                        label: "a",
                        controller: (fieldController) => {
                            this.numberA = fieldController;
                        },
                    }),
                    new NodeField({
                        value: 0,
                        label: "b",
                        controller: (fieldController) => {
                            this.numberB = fieldController;
                        },
                    }),
                    new NodeButton({
                        label: "Subtract",
                        onClick: () => {
                            alert(
                                Number(this.numberA.value) -
                                    Number(this.numberB.value)
                            );
                        },
                    }),
                ],
            }),
        });
    }
}
export class MultiplyNode extends WireNode {
    numberA!: NodeFieldController;
    numberB!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(): NodeData {
        return {
            name: "Multiply Node",
            documentation:
                "This node is an experiment node used to multiply two numbers",
        };
    }

    build(): Widget {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Multiply Node",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        value: 0,
                        label: "a",
                        controller: (fieldController) => {
                            this.numberA = fieldController;
                        },
                    }),
                    new NodeField({
                        value: 0,
                        label: "b",
                        controller: (fieldController) => {
                            this.numberB = fieldController;
                        },
                    }),
                ],
            }),
            footer: new NodeFooter({
                child: new NodeButton({
                    label: "Multiply",
                    onClick: () => {
                        alert(
                            Number(this.numberA.value) *
                                Number(this.numberB.value)
                        );
                    },
                }),
            }),
        });
    }
}
export class DivideNode extends WireNode {
    numberA!: NodeFieldController;
    numberB!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(): NodeData {
        return {
            name: "Divide Node",
            documentation:
                "This node is an experiment node used to divide two numbers",
        };
    }

    build(): Widget {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Divide Node",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        value: 0,
                        label: "a",
                        controller: (fieldController) => {
                            this.numberA = fieldController;
                        },
                    }),
                    new NodeField({
                        value: 0,
                        label: "b",
                        controller: (fieldController) => {
                            this.numberB = fieldController;
                        },
                    }),
                    new NodeButton({
                        label: "Divide",
                        onClick: () => {
                            alert(
                                Number(this.numberA.value) /
                                    Number(this.numberB.value)
                            );
                        },
                    }),
                ],
            }),
        });
    }
}