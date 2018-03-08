import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'input-dialog',
    template: `
    <div class="container">
        <h4 mat-dialog-title>{{title}}</h4>
        
        <div mat-dialog-content>
            <p *ngIf="description">{{description}}</p>
            <mat-form-field>
                <input matInput [placeholder]="inputText" [(ngModel)]="inputString">
            </mat-form-field>
        </div>

        <div mat-dialog-actions>
            <div fxLayout="row">
                <button mat-raised-button [mat-dialog-close]="inputString">Confirm</button>
                <button mat-raised-button (click)="onNoClick()">Cancel</button>
            </div>
        </div>
    </div>`,
    styles: [`
        h4 {
            font-family: Roboto;
        }
        p {
            font-family: Roboto;
            font-size: 12px;
        }
        .mat-form-field {
            width: 100%;
        }
    `]
})
export class InputDialogComponent implements OnInit {

    title: string;
    inputString: string;
    description: string;
    inputText: string;

    constructor(
        public dialogRef: MatDialogRef<InputDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    ngOnInit(){
        this.title = this.data.title ? this.data.title : "Type input";
        this.description = this.data.description ? this.data.description : null;
        this.inputText = this.data.inputText ? this.data.inputText : "Input";
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}