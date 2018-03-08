import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'video-dialog',
    template: `
    <iframe [src]='data.url' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>`,
    styles: [`
    iframe{
        width: 100%;
        height: 98%;
    }
    `]
})
export class VideoDialog {

    constructor(
        public dialogRef: MatDialogRef<VideoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}