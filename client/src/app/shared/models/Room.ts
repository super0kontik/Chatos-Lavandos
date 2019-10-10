import {Message} from "./Message";
import {User} from "./User";

export interface Room {
    id: string;
    title: string;
    users: User[];
}
