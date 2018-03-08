import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, DOCUMENT  } from '@angular/platform-browser';

import { SettingsDialog } from './settings-dialog/settings-dialog.component';
import { MessageDialog } from '../dialogs/message-dialog.component';
import { VideoDialog } from '../dialogs/video-dialog.component';

@Component({
  selector: 'visualizer-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Input() title: string;
  @Input() creator: string;

  videos = [
      {title: "1: The basics", id:"ixrhgKHKXDY"},
      {title: "2: Running locally", id: "KgtAgyzwEpk"}
  ]

  about = `
The development of this tool was initiated by [Mads Holten Rasmussen](researchgate.net/profile/Mads_Holten_Rasmussen) and is distributed under the [GNU General Public License](https://www.gnu.org/licenses/gpl.txt).

It is based on several open libraries; [rdfstore](https://www.npmjs.com/package/rdfstore), [D3](https://d3js.org/), [Angular](https://angular.io/) etc. and is supposed to be further developed under a copyleft licence.

Please join the effort in further developing the tool so ontology designers can use it in their prototyping and communication. The repo can be forked from [here](https://github.com/MadsHolten/sparql-visualizer).

A special thanks to [Niras](https://www.niras.com/) for co-funding the Industrial PhD-project under which the tool has been developed.`;



  constructor(
      public dialog: MatDialog,
      private _sanitizer: DomSanitizer,
      @Inject(DOCUMENT) private document: any) {}

  change(ev){
    console.log(ev.target.value)
    this.title = ev.target.value;
  }

  showAbout(){
      let dialogRef = this.dialog.open(MessageDialog, {
        height: '300px',
        width: '500px',
        data: {title: "About", message: this.about}
      });
  }

  downloadApp(){
    this.document.location.href = 'https://github.com/MadsHolten/sparql-visualizer/blob/master/sparql-viz.zip?raw=true';
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
    let dialogRef = this.dialog.open(MessageDialog, {
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