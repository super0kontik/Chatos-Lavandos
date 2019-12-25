import {Component, OnInit} from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {SMILES} from "../../shared/data";
import {ChatService} from "../../shared/services/chat.service";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-mobile-smile',
    templateUrl: './mobile-smile.component.html',
    styleUrls: ['./mobile-smile.component.scss']
})
export class MobileSmileComponent implements OnInit {
    public smiles: string[] = [];
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.5, scrollingThreshold: 0,};
    public theme: string = 'dark';

    constructor(private _bottomSheetRef: MatBottomSheetRef<MobileSmileComponent>,
                private chatService: ChatService) {}

    ngOnInit() {
        this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
        this.smiles = Object.values(SMILES);
    }

    public onClose(event): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    public sendToInput(event) {
        document.querySelector('div.composer_rich_textarea')['innerText'] += event.target.innerText;
    }
}
