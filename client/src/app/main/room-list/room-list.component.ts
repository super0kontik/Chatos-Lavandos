import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {log} from "util";

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
    @Input() rooms: Room[];
    public searchedRooms: Room[];
    @Output() onSelectedRoom: EventEmitter<any> = new EventEmitter<any>();
    public searchText: string = '';
    public isSearchRoomList: boolean = false;
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor(private socketService: SocketService) {
    }

    public ngOnInit(): void {
        this.socketService.listen('searchRoomsResult').subscribe(rooms => {
            this.searchedRooms = rooms;
        });
    }

    public goToRoom(searchedRoom: Room | number): void {
        if (typeof searchedRoom === 'number') {
           this.onSelectedRoom.emit(searchedRoom);
        } else {
            searchedRoom = searchedRoom as Room;
            for (let room of this.rooms) {
                if (room._id === searchedRoom._id) {
                    this.onSelectedRoom.emit(searchedRoom.index);
                    return;
                }
            }
            //ШО СЮДА НУЖНО !!!! ???'
        }
    }

    public searchRooms(): void {
        this.socketService.emit('searchRooms', this.searchText);
    }

    public toggleSearch(): void {
        this.isSearchRoomList = !this.isSearchRoomList;
    }

}
