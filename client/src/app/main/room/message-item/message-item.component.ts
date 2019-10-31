import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../../../shared/models/Message";
import {LocalStorageService} from "../../../shared/services/local-storage.service";

@Component({
    selector: 'app-message-item',
    templateUrl: './message-item.component.html',
    styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
    @Input() message: Message;
    @Input() users: any[];
    @Output() loadRequest: EventEmitter<any> = new EventEmitter<any>();

    public me: string = '';

    constructor() {
    }

    ngOnInit() {
        this.me = LocalStorageService.getUser()['id'];
    }

    public messageRequest(scroll?: boolean): void {
        this.loadRequest.emit(scroll);
    }

}
