import { Component, OnInit } from '@angular/core';
import {range, Subscription} from "rxjs";

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
    public list: number[] = [];
    public ranger: Subscription;

    constructor() {
    }

    ngOnInit() {
        this.ranger = range(1, 100).subscribe(
            num => {
                this.list.push(num);
            }
        );
    }

    public aSub() {
        this.ranger.unsubscribe();
    }

}
