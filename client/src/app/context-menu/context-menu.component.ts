import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
    @ViewChild('contextMenuContainer', {static: true}) menu: ElementRef;

    constructor() {
    }

    public setPosition(x: number, y: number): void {
        this.menu.nativeElement.style.top = `${y}px`;
        this.menu.nativeElement.style.left = `${x}px`;
    }

    public selectedOption(): void {
        console.log(1);
    }

}
