import {Pipe, PipeTransform} from '@angular/core';
import {Room} from "../models/Room";

@Pipe({
    name: 'updateRooms'
})
export class UpdateRoomsPipe implements PipeTransform {
    transform(rooms: Room[]): Room[] {
        rooms.sort((prevRoom, nextRoom) => {
            if (prevRoom.lastAction < nextRoom.lastAction) {
                return 1;
            } else if (prevRoom.lastAction > nextRoom.lastAction) {
                return -1;
            } else {
                return 0;
            }
        });
        return rooms;
    }
}
