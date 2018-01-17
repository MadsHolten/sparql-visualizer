import { Component, OnInit } from '@angular/core';

// Services
import { ProjectSettingsService } from '../services/project-settings.service';

export interface ProjectSettings {
  endpoint: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [ ProjectSettingsService ]
})
export class SettingsComponent implements OnInit {

  panelOpenState: boolean = false;
  projectSettings: ProjectSettings = {endpoint: ''};

  constructor(
    private pss: ProjectSettingsService
  ) { }

  ngOnInit() {
    // Get data from local storage
    var data = this.pss.getTriplestoreSettings();
    if(data){
      this.projectSettings = data;
    }else{
      this.projectSettings.endpoint = "";
    }
  }

  onDataChange(){
    // Save to localstore
    this.pss.saveTriplestoreSettings(this.projectSettings);
  }

}
