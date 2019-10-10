import {Component, OnInit} from '@angular/core';
import {SMILES} from "../../shared/data";

@Component({
    selector: 'app-smiles',
    templateUrl: './smiles.component.html',
    styleUrls: ['./smiles.component.scss']
})
export class SmilesComponent implements OnInit {
    public smiles: string[] = [];


    constructor() {
    }

    ngOnInit() {
        this.smiles = Object.values(SMILES);
    }

}
