import { bind, doc } from "../api/decorators";
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


// @doc("Add Node", "This node is an experiment node used to add two numbers")
export class AddNode extends WireNode {
    number1Controller!: NodeFieldController;
    number2Controller!: NodeFieldController;
    result?: number;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
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

@doc("Subtract Node", "This node is an experiment node used to subtract two numbers")
export class SubtractNode extends WireNode {
    numberA!: NodeFieldController;
    numberB!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
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

@doc("Multiply Node", "This node is an experiment node used to multiply two numbers")
export class MultiplyNode extends WireNode {
    numberA!: NodeFieldController;
    numberB!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
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

@doc("Divide Node", "This node is an experiment node used to divide two numbers")
export class DivideNode extends WireNode {
    numberA!: NodeFieldController;
    numberB!: NodeFieldController;
    constructor(instantiatedPoint: Vector2) {
        super(instantiatedPoint);
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

@doc("Variable Node","This node is an experiment node used to store a variable")
export class VariableNode extends WireNode {
    controller!: NodeFieldController;

    build(): Widget {
        return new NodeScaffold({
            header: new NodeHeader({
                title: "Variable Node",
            }),
            body: new NodeBody({
                children: [
                    new NodeField({
                        value: '',
                        label: "x",
                        fieldType: "both",
                        onConnect:({data})=>{
                            this.controller.value = this.controller.value.toString() + data?.toString() ?? '';
                        },
                        controller: (fieldController) => {
                            this.controller = fieldController;
                        },
                    }),
                ],
            }),
        });
    }

    @bind
    out(): WireOutData {
        return {
            data: this.controller.value,
        };
    }
}
