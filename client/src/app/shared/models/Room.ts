import {Message} from "./Message";
import {User} from "./User";

export interface Room {
    _id: string;
    title: string;
    users: User[];
    creator: User;
}
