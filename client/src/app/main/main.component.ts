import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    @ViewChild('cardInner', {static: false}) card: ElementRef;
    public isFlipped: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    public flipCardToggler() {
        if (!this.isFlipped) {
            this.card.nativeElement.style.transform = 'rotateY(180deg)';
            this.isFlipped = true;
        } else {
            this.card.nativeElement.style.transform = '';
            this.isFlipped = false;
        }

    }

}
