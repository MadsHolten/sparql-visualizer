import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'msg-dialog',
    template: `<h4>{{data.title}}</h4>
    <p [innerHTML]="data.message | MarkdownToHtml"></p>`,
    styles: [`
        h4 {
            font-family: Roboto;
        }
        p {
            font-family: Roboto;
            font-size: 12px;
        }
    `]
})
export class MessageDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<MessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}