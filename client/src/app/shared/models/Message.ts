import {User} from "./User";

export interface Message {
    createdAt: Date;
    content: string;
    user: User;
}
