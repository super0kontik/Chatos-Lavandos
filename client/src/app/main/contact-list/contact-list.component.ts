import {Component, Input, OnInit} from '@angular/core';
import {range, Subscription} from "rxjs";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
    @Input() isDisplayed: boolean;

    public list: number[] = [];
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };

    constructor() {
    }

    public ngOnInit(): void {
        range(1, 100).subscribe(
            num => {
                this.list.push(num);
            }
        );
    }

}
