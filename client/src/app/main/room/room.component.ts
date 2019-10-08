import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    @Input() currentRoom: Room;

    constructor() {
    }

    ngOnInit() {
    }

    public onChange(event): void {

    }

}
