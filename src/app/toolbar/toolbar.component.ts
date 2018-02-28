import { Component, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'visualizer-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Input() title: string;
  @Input() creator: string;
  about = `
The development of this tool was initiated by [Mads Holten Rasmussen](researchgate.net/profile/Mads_Holten_Rasmussen) and is distributed under the [GNU General Public License](https://www.gnu.org/licenses/gpl.txt).

It is based on several open libraries; [rdfstore](https://www.npmjs.com/package/rdfstore), [D3](https://d3js.org/), [Angular](https://angular.io/) etc. and is supposed to be further developed under a copyleft licence.

Please join the effort in further developing the tool so ontology designers can use it in their prototyping and communication. The repo can be forked from [here](https://github.com/MadsHolten/sparql-visualizer).

A special thanks to [Niras](https://www.niras.com/) for co-funding the Industrial PhD-project under which the tool has been developed.`;

  constructor(public dialog: MatDialog) {}

  change(ev){
    console.log(ev.target.value)
    this.title = ev.target.value;
  }

  showAbout(){
      let dialogRef = this.dialog.open(AboutDialog, {
        height: '300px',
        width: '500px',
        data: {title: "About", message: this.about}
      });
  }

  showWIP(){
    let dialogRef = this.dialog.open(AboutDialog, {
        height: '300px',
        width: '500px',
        data: {title: "WIP", message: "This feature is yet to be implemented."}
    });
  }

}

// Dialog
@Component({
    selector: 'about-dialog',
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
export class AboutDialog {

    constructor(
        public dialogRef: MatDialogRef<AboutDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}