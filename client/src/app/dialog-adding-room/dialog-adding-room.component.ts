import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-dialog-adding-room',
    templateUrl: './dialog-adding-room.component.html',
    styleUrls: ['./dialog-adding-room.component.scss']
})
export class DialogAddingRoomComponent implements OnInit {
    public addRoomForm: FormGroup; // form group instance
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor(
        public dialogRef: MatDialogRef<DialogAddingRoomComponent>,
        private fb: FormBuilder
    ) {}

    public ngOnInit() {
        this.addRoomForm = this.fb.group({
            title: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(20),
            ]
            ],
            participants: this.fb.array([this.fb.group({id: ['',
                    [Validators.required
                        /*Validators.pattern('^[0-9]+$')*/]
                ]})])
        });
    }

    public get participants(): FormArray {
        return this.addRoomForm.get('participants') as FormArray;
    }

    public addParticipant(): void {
        this.participants.push(this.fb.group({id:['',
                [Validators.required/*, Validators.pattern('^[0-9]+$')*/]
            ]}));
    }

    public deleteParticipant(index): void {
        this.participants.removeAt(index);
    }

    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    public onCreate(): void {
        const participants = [];
        Object.values(this.addRoomForm.get('participants').value).forEach(participant => {
            participants.push(participant['id']);
        });
        this.dialogRef.close({
            roomTitle: this.addRoomForm.get('title').value,
            participants,
        });
    }

}
