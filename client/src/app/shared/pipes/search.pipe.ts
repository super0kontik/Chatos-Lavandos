import {Pipe, PipeTransform} from '@angular/core';
import {Room} from "../models/Room";

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {
    transform(rooms: Room[], searchText: string): Room[] {
        return rooms.filter(room => room.title.toLowerCase().includes(searchText.toLowerCase()));
    }
}
