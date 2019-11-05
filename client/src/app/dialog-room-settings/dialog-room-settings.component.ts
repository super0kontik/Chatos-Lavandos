import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from "../shared/services/local-storage.service";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Room} from "../shared/models/Room";

@Component({
  selector: 'app-dialog-room-settings',
  templateUrl: './dialog-room-settings.component.html',
  styleUrls: ['./dialog-room-settings.component.scss']
})
export class DialogRoomSettingsComponent implements OnInit {
    @ViewChild('title', {static: false}) title: ElementRef;
    private me: string = LocalStorageService.getUser()['id'];
    public removedUserIds: string[] = [];
    public isPublic: boolean = true;
    public delete: boolean = false;
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.2, scrollingThreshold: 0};

    constructor(public dialogRef: MatDialogRef<DialogRoomSettingsComponent>,
                @Inject(MAT_DIALOG_DATA) public room: Room) {}

    public ngOnInit(): void {
        this.room.users = this.room.users.filter(user => user._id !== this.me);
    }

    public onUpdate(): void {
        this.room.title = this.title.nativeElement.innerText;
        this.dialogRef.close({...this.room, deletedUsers: this.removedUserIds});
    }

    public onDelete(): void {
        this.dialogRef.close({
            roomId: this.room._id,
            delete: true
        });
    }

    public deleteParticipant(id: string): void {
        this.removedUserIds.push(id);
        this.room.users = this.room.users.filter(user => user._id !== id);
    }

    public deleteConfirm(): void {
        this.delete = !this.delete;
    }

    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    public switchPrivate(): void {
        this.room.isPublic = !this.room.isPublic;
    }
}
