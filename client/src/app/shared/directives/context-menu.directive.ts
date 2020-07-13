import {Directive, HostListener, Input} from '@angular/core';
import {ChatService} from "../services/chat.service";

@Directive({
    selector: '[context-menu]',
})
export class ContextMenuDirective {
    @Input('context-menu') options;
    @Input() isMyMessage: boolean = true;

    constructor(private chatService: ChatService) {
    }

    @HostListener('contextmenu', ['$event']) rightClicked(event: MouseEvent): void {
        event.preventDefault();
        if (this.isMyMessage) {
            this.chatService.showContextMenu.next({event, options: this.options});
        }
    }
}
