import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'select-dialog',
    template: `
    <div class="container">
        <h4 mat-dialog-title>{{title}}</h4>
        
        <div mat-dialog-content>
            <p *ngIf="description">{{description}}</p>
            <mat-form-field>
                <mat-select [placeholder]="selectText" [(value)]="selected">
                    <mat-option *ngFor="let item of list" [value]="item">
                        {{ item }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
        </div>

        <div mat-dialog-actions>
            <div fxLayout="row">
                <button mat-raised-button [mat-dialog-close]="selected">Confirm</button>
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
export class SelectDialogComponent implements OnInit {

    title: string;
    inputString: string;
    description: string;
    selectText: string;
    list: any[];
    selected;

    constructor(
        public dialogRef: MatDialogRef<SelectDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    ngOnInit(){
        this.title = this.data.title ? this.data.title : "Choose from list";
        this.description = this.data.description ? this.data.description : null;
        this.selectText = this.data.selectText ? this.data.selectText : "Select";
        this.list = this.data.list;
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}