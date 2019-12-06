import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../shared/services/socket.service";
import {LocalStorageService} from "../shared/services/local-storage.service";
import {ChatService} from "../shared/services/chat.service";

@Component({
    selector: 'app-dialog-adding-room',
    templateUrl: './dialog-adding-room.component.html',
    styleUrls: ['./dialog-adding-room.component.scss']
})
export class DialogAddingRoomComponent implements OnInit {
    private me = LocalStorageService.getUser()['id'];
    public addRoomForm: FormGroup;
    public selectedInput: number = null;
    public searchedUsers: any;
    public userIds: any[] = [false];
    public isPublic = true;
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.2, scrollingThreshold: 0};
    public theme: string = 'dark';

    constructor(public dialogRef: MatDialogRef<DialogAddingRoomComponent>,
                private fb: FormBuilder,
                private socketService: SocketService,
                private chatService: ChatService) {}

    public ngOnInit(): void {
        this.chatService.theme.subscribe(selectedTheme => {
            this.theme = selectedTheme;
        });
        this.addRoomForm = this.fb.group({
            title: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(20)]],
            participants: this.fb.array([this.fb.group({name: ['', [Validators.required]]})])
        });
        this.onSearch();

        this.socketService.listen('searchResult').subscribe(users => {
            if (users.length === 1 && this.addRoomForm.get('participants').value[this.selectedInput].name === users[0].name) {
                this.userIds[this.selectedInput] = users[0]._id;
            } else {
                this.searchedUsers = users.filter(user => user._id !== this.me);
                this.userIds[this.selectedInput] = false;
            }
        });
    }

    public get participants(): FormArray {
        return this.addRoomForm.get('participants') as FormArray;
    }

    public addParticipant(): void {
        this.participants.push(this.fb.group({name:['', [Validators.required]]}));
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
        this.userIds = this.userIds.filter(userId => userId !== this.me);
        this.userIds = Array.from(new Set(this.userIds));
        this.dialogRef.close({
            roomTitle: this.addRoomForm.get('title').value,
            participants: this.userIds,
            isPublic: this.isPublic
        });
    }

    public onSearch(): void {
        this.addRoomForm.valueChanges.subscribe(changes => {
            if(this.selectedInput !== null) {
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
        this.userIds = this.userIds.filter(userId => userId !== this.me);
        return this.userIds.every(item => !!item) && this.userIds.length > 0;
    }

    public switchPrivate(): void {
        this.isPublic = !this.isPublic;
    }

}
