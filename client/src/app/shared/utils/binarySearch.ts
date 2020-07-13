import {Message} from "../models/Message";

export function iterativeBS(arr: Message[], x: any) {
    let start = 0;
    let end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (+ new Date(arr[mid].createdAt) === +new Date(x.createdAt) && arr[mid]._id === x.id) return mid;
        else if ( +new Date(arr[mid].createdAt) < +new Date(x.createdAt))
            start = mid + 1;
        else
            end = mid - 1;
    }
    return -1;
}
