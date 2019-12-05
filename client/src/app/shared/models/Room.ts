import {User} from "./User";

export interface Room {
    _id: string;
    title: string;
    users: User[];
    creator: User;
    index?: number;
    lastAction?: Date;
    isPublic: boolean;
}
