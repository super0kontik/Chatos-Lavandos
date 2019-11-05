import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-dialog-invitation',
    templateUrl: './dialog-invitation.component.html',
    styleUrls: ['./dialog-invitation.component.scss']
})
export class DialogInvitationComponent {
    constructor(public dialogRef: MatDialogRef<DialogInvitationComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {}

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
