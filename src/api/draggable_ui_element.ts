import { Vector2 } from "../interfaces/node";
import { bind } from "./decorators";

export class DraggableUIElement {
    pos1 = 0;
    pos2 = 0;
    pos3 = 0;
    pos4 = 0;

    constructor(
        private targetElement: HTMLElement,
        private onDrag?: (newPosition: Vector2, dragEvent: MouseEvent) => void,
        private onDragStart?: (elementPosition: Vector2) => void,
        private onDragEnd?: (elementPosition: Vector2) => void,
        triggerElement?: HTMLElement
    ) {
        if (triggerElement) triggerElement.onmousedown = this.dragMouseDown;
        else targetElement.onmousedown = this.dragMouseDown;
    }

    @bind
    dragMouseDown(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        this.onDragStart?.call(this, { x: e.clientX, y: e.clientY });
        document.onmouseup = this.closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag;
    }

    @bind
    elementDrag(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        let newX = this.targetElement.offsetLeft - this.pos1;
        let newY = this.targetElement.offsetTop - this.pos2;
        // set the element's new position:
        this.targetElement.style.top = newY + "px";
        this.targetElement.style.left = newX + "px";

        this.onDrag?.call(this, { x: newX, y: newY }, e);
    }

    @bind
    closeDragElement() {
        // snap element to nearest 10 pixels
        this.targetElement.style.top =
            Math.round(this.targetElement.offsetTop / 10) * 10 + "px";
        this.targetElement.style.left =
            Math.round(this.targetElement.offsetLeft / 10) * 10 + "px";
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        this.onDragEnd?.call(this,{
            x: Math.round(this.targetElement.offsetLeft / 10) * 10,
            y: Math.round(this.targetElement.offsetTop / 10) * 10,
        });
    }
}
