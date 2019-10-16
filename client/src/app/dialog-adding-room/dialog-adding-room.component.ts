import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-dialog-adding-room',
    templateUrl: './dialog-adding-room.component.html',
    styleUrls: ['./dialog-adding-room.component.scss']
})
export class DialogAddingRoomComponent implements OnInit {
    public addRoomForm: FormGroup; // form group instance

    constructor(
        public dialogRef: MatDialogRef<DialogAddingRoomComponent>,
        private fb: FormBuilder
    ) {}

    public ngOnInit() {
        this.addRoomForm = this.fb.group({
            title: ['', Validators.required],
            participants: this.fb.array([this.fb.group({id: ''})])
        });
    }

    public get participants(): FormArray {
        return this.addRoomForm.get('participants') as FormArray;
    }

    public addSellingPoint(): void {
        this.participants.push(this.fb.group({id:''}));
    }

    public deleteSellingPoint(index): void {
        this.participants.removeAt(index);
    }

    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    public onAdd(): void {
        const participants = [];
        Object.values(this.addRoomForm.get('participants').value).forEach(participant => {
            participants.push(participant['id']);
        });
        this.dialogRef.close({
            title: this.addRoomForm.get('title').value,
            participants,
        });
    }

}
