import {Message} from "./Message";
import {User} from "./User";

export interface Room {
    name: string;
    users: string[];
    messages: Message[];
}
