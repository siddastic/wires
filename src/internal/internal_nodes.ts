import { bind } from "../api/decorators";
import { NodeFieldController } from "../api/node_field_controller";
import {
    NodeBody,
    NodeField,
    NodeHeader,
    NodeScaffold,
    Widget,
} from "../api/widgets";
import { WireNode } from "../api/wire_node";
import { NodeData, Vector2, WireOutData } from "../interfaces/node";

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
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Add Node",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        label: "a",
                        value: this.number1Controller?.value ?? "0",
                        inputType: "number",
                        controller: (fieldController) => {
                            this.number1Controller = fieldController;
                        },
                    }),
                    new NodeField({
                        label: "b",
                        value: this.number2Controller?.value ?? "0",
                        inputType: "number",
                        controller: (fieldController) => {
                            this.number2Controller = fieldController;
                        },
                    }),
                ],
            }),
        });
    }

    @bind
    out(): WireOutData {
        return {
            data: this.number1Controller.numVal + this.number2Controller.numVal,
        };
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
                ],
            }),
        });
    }

    @bind
    out(): WireOutData {
        return {
            data: this.numberA.numVal - this.numberB.numVal,
        };
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
        });
    }

    @bind
    out(): WireOutData {
        return {
            data: this.numberA.numVal * this.numberB.numVal,
        };
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
                ],
            }),
        });
    }

    @bind
    out(): WireOutData {
        return {
            data: this.numberA.numVal / this.numberB.numVal,
        };
    }
}

export class VariableNode extends WireNode {
    data!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
    }

    static doc(): NodeData {
        return {
            name: "Variable Node",
            documentation:
                "It can be used to store data, it returns whatever data is stored in it",
        };
    }

    build(): Widget {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Variable Node",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        label: "x",
                        fieldType: "input",
                        controller: (fieldController) => {
                            this.data = fieldController;
                        },
                    }),
                ],
            }),
        });
    }

    @bind
    out(): WireOutData {
        return {
            data: this.data.value,
        };
    }
}
