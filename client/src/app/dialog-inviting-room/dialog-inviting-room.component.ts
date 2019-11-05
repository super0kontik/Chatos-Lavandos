import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SocketService} from "../shared/services/socket.service";

@Component({
    selector: 'app-dialog-inviting-room',
    templateUrl: './dialog-inviting-room.component.html',
    styleUrls: ['./dialog-inviting-room.component.scss']
})
export class DialogInvitingRoomComponent implements OnInit {
    public addUsersForm: FormGroup; // form group instance
    public selectedInput: number = 0;
    public searchedUsers: any[] = [];
    public userIds: any = [false];
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.2, scrollingThreshold: 0};

    constructor(public dialogRef: MatDialogRef<DialogInvitingRoomComponent>,
                private fb: FormBuilder,
                private socketService: SocketService,
                @Inject(MAT_DIALOG_DATA) public data) {}

    public ngOnInit(): void {
        console.log(this.data);
        this.addUsersForm = this.fb.group({
            participants: this.fb.array([this.fb.group({
                name: ['',
                    [Validators.required]
                ]
            })])
        });

        this.onSearch();

        this.socketService.listen('searchResult').subscribe(users => {
            if (users.length === 1 && this.addUsersForm.get('participants').value[this.selectedInput].name === users[0].name) {
                let flag = false;
                for (let roomUser of this.data.users) {
                    if (users[0]._id !== roomUser._id) {
                        flag = true;
                    } else {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    this.userIds[this.selectedInput] = users[0]._id;
                } else {
                    this.userIds[this.selectedInput] = false;
                }
            } else {
                this.searchedUsers = users.filter(user => {
                    let flag = false;
                    for (let roomUser of this.data.users) {
                        if (user._id !== roomUser._id) {
                            flag = true;
                        } else {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                });
                this.userIds[this.selectedInput] = false;
            }
        });
    }

    public get participants(): FormArray {
        return this.addUsersForm.get('participants') as FormArray;
    }

    public addParticipant(): void {
        this.participants.push(this.fb.group({
            name: ['',
                [Validators.required]
            ]
        }));
        this.userIds.push(false);
    }

    public deleteParticipant(index: number): void {
        this.selectedInput = null;
        this.participants.removeAt(index);
        this.userIds.splice(index, 1);
    }

    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    public onCreate(): void {
        this.userIds = this.userIds.filter(userId => {
            let flag = false;
            for (let roomUser of this.data.users) {
                if (userId !== roomUser._id) {
                    flag = true;
                } else {
                    flag = false;
                    break;
                }
            }
            if (!userId) {
                flag = false;
            }
            return flag;
        });
        this.userIds = Array.from(new Set(this.userIds));
        this.dialogRef.close({
            roomId: this.data._id,
            participants: this.userIds,
        });
    }

    public onSearch(): void {
        this.addUsersForm.valueChanges.subscribe(changes => {
            if (this.selectedInput !== null) {
                if (changes.participants[this.selectedInput].name.length > 2) {
                    this.socketService.emit('searchUsers', changes.participants[this.selectedInput].name);
                }
            }
        });
    }

    public pushId(userId: string): void {
        this.userIds[this.selectedInput] = userId;
    }

    public validateInputs(): boolean {
        this.userIds = this.userIds.filter(userId => {
            let flag = false;
            for (let roomUser of this.data.users) {
                if (userId !== roomUser._id) {
                    flag = true;
                } else {
                    flag = false;
                    break;
                }
            }
            return flag;
        });
        return this.userIds.every(item => !!item);
    }
}
