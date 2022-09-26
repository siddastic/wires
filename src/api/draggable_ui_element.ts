import { bind } from "./decos";

export class DraggableUIElement {
    pos1 = 0; pos2 = 0; pos3 = 0; pos4 = 0;

    constructor(private targetElement: HTMLElement, private onDrag?: () => void, triggerElement?: HTMLElement) {
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
        // set the element's new position:
        this.targetElement.style.top = (this.targetElement.offsetTop - this.pos2) + "px";
        this.targetElement.style.left = (this.targetElement.offsetLeft - this.pos1) + "px";

        this.onDrag?.call(this);

    }

    @bind
    closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}