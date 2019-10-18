import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-dialog-invitation',
    templateUrl: './dialog-invitation.component.html',
    styleUrls: ['./dialog-invitation.component.scss']
})
export class DialogInvitationComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DialogInvitationComponent>,
                @Inject(MAT_DIALOG_DATA) public data
    ) {
    }

    public ngOnInit(): void {
    }

    public onAgree(): void {
        this.dialogRef.close({
            isAgree: true,
            roomId: this.data._id
        });
    }

    public onDisagree(): void {
        this.dialogRef.close({
            isAgree: false,
            roomId: this.data._id
        });
    }

}
