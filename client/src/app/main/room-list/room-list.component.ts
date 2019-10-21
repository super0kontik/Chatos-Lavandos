import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent {
    @Input() rooms: Room[];
    @Output() onSelectedRoom: EventEmitter<any> = new EventEmitter<any>();
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor() {
    }

    public goToRoom(index: number): void {
        this.onSelectedRoom.emit(index);
    }

}
