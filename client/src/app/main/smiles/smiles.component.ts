import {Component, OnInit} from '@angular/core';
import {SMILES} from "../../shared/data";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {ChatService} from "../../shared/services/chat.service";

@Component({
    selector: 'app-smiles',
    templateUrl: './smiles.component.html',
    styleUrls: ['./smiles.component.scss']
})
export class SmilesComponent implements OnInit {
    public smiles: string[] = [];
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };
    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.smiles = Object.values(SMILES);
    }

    public sendToInput(event): void {
        this.chatService.sendSmile.next(event.target.innerText);
    }

}
