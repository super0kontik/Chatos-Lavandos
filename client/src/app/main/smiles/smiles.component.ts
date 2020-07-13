import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {SMILES} from "../../shared/data";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {ChatService} from "../../shared/services/chat.service";
import {MAT_BOTTOM_SHEET_DATA} from "@angular/material/bottom-sheet";

@Component({
    selector: 'app-smiles',
    templateUrl: './smiles.component.html',
    styleUrls: ['./smiles.component.scss']
})
export class SmilesComponent implements OnInit {
    @Output() closeParticipants: EventEmitter<any> = new EventEmitter<any>();
    public smiles: string[] = [];
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.5, scrollingThreshold: 0,};
    public theme: string = 'dark';

    constructor(public chatService: ChatService) {}

    public ngOnInit(): void {
        this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
        this.smiles = Object.values(SMILES);
    }

    public sendToInput(event): void {
        document.querySelector('div.composer_rich_textarea')['innerText'] += event.target.innerText;
    }

}
