import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../shared/services/chat.service";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
    @ViewChild('cardInner', {static: false}) card: ElementRef;


    public isFlipped: boolean = false;
    public isLoaded: boolean = false;

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chatService.flipCard.subscribe(flip => {
            if (this.isLoaded) {
                this.flipCardToggler();
            }
        });
    }

    public ngAfterViewInit(): void {
        this.isLoaded = true;
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
