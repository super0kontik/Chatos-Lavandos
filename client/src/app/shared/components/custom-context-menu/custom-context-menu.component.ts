import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Option} from "../../models/Option";

@Component({
    selector: 'app-custom-context-menu',
    templateUrl: './custom-context-menu.component.html',
    styleUrls: ['./custom-context-menu.component.scss'],
    host:{
        '(document:click)': 'clickedOutside()'
    },
})
export class CustomContextMenuComponent implements OnInit {
    public options: Option[] = [];
    public isShown: boolean = false;
    private mouseLocation: {left: number, top: number} = {left: 0, top: 0};

    constructor(private chatService: ChatService) {
    }

    public ngOnInit(): void {
        this.chatService.showContextMenu.subscribe((data) => {
            if (data) {
                this.options = data.options;
                this.isShown = true;
                this.mouseLocation = {left: data.event.clientX, top: data.event.clientY};
            }
        });
    }

    public clickedOutside(): void {
        this.isShown = false;
    }

    public get locationCss(): object {
        return {
            display: this.isShown ? 'block' : 'none',
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px',
        };
    }

    public selectOption(optionId: string): void {
        this.chatService.emitOption.next(optionId);
    }

}
