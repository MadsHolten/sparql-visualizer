import { Component, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { SettingsDialog } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'visualizer-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Input() title: string;
  @Input() creator: string;

  videos = [
      {title: "1: The basics", id:"ixrhgKHKXDY"}
  ]

  about = `
The development of this tool was initiated by [Mads Holten Rasmussen](researchgate.net/profile/Mads_Holten_Rasmussen) and is distributed under the [GNU General Public License](https://www.gnu.org/licenses/gpl.txt).

It is based on several open libraries; [rdfstore](https://www.npmjs.com/package/rdfstore), [D3](https://d3js.org/), [Angular](https://angular.io/) etc. and is supposed to be further developed under a copyleft licence.

Please join the effort in further developing the tool so ontology designers can use it in their prototyping and communication. The repo can be forked from [here](https://github.com/MadsHolten/sparql-visualizer).

A special thanks to [Niras](https://www.niras.com/) for co-funding the Industrial PhD-project under which the tool has been developed.`;



  constructor(
      public dialog: MatDialog,
      private _sanitizer: DomSanitizer) {}

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

  showVideo(videoId){
      var safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
      let dialogRef = this.dialog.open(VideoDialog, {
        height: '80%',
        width: '70%',
        data: {url: safeURL}
      });
  }

  showWIP(){
    let dialogRef = this.dialog.open(AboutDialog, {
        height: '300px',
        width: '500px',
        data: {title: "WIP", message: "This feature is yet to be implemented."}
    });
  }

  showSettings(){
    let dialogRef = this.dialog.open(SettingsDialog, {
        height: '300px',
        width: '500px'
    });
  }

}

// About Dialog
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

// Video Dialog
@Component({
    selector: 'video-dialog',
    template: `
    <iframe [src]='data.url' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>`,
    styles: [`
    iframe{
        width: 100%;
        height: 95%;
    }
    `]
})
export class VideoDialog {

    constructor(
        public dialogRef: MatDialogRef<AboutDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}