import {Component, OnInit} from '@angular/core';
import {SMILES} from "../../shared/data";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-smiles',
    templateUrl: './smiles.component.html',
    styleUrls: ['./smiles.component.scss']
})
export class SmilesComponent implements OnInit {
    public smiles: string[] = [];
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.5, scrollingThreshold: 0,};

    public ngOnInit(): void {
        this.smiles = Object.values(SMILES);
    }

    public sendToInput(event): void {
        document.querySelector('div.composer_rich_textarea')['innerText'] += event.target.innerText;
    }

}
