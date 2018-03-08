import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';

// Services
import { ProjectSettingsService } from '../services/project-settings.service';
import { StardogService } from '../services/stardog.service';
import { DataService } from '../services/data.service';

// Dialogs
import { InputDialogComponent } from '../dialogs/input-dialog.component';
import { SelectDialogComponent } from '../dialogs/select-dialog.component';

export interface ProjectSettings {
  endpoint: string;
  database: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [ ProjectSettingsService, StardogService ]
})
export class SettingsComponent implements OnInit, OnChanges {

  panelOpenState: boolean = false;
  projectSettings: ProjectSettings = {endpoint: '', database: ''};
  loading: boolean;
  loadingMessage: string;

  @Input() triples: string;

  constructor(
    private _pss: ProjectSettingsService,
    private _ss: StardogService,
    private _ds: DataService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Get data from local storage
    var data = this._pss.getTriplestoreSettings();
    if(data){
      this.projectSettings = data;
    }else{
      this.projectSettings.endpoint = "http://localhost:5820"; //default
      this.projectSettings.username = "admin"; //default
      this.projectSettings.password = "admin"; //default
    }

    // Inject shared services
    this._ds.loadingStatus.subscribe(loading => this.loading = loading);
    this._ds.loadingMessage.subscribe(msg => this.loadingMessage = msg);
  }

  ngOnChanges(changes: SimpleChanges){
    this.triples = changes.triples.currentValue;
  }

  onDataChange(){
    // Save to localstore
    this._pss.saveTriplestoreSettings(this.projectSettings);
  }

  showLoadToNamed(){
      let dialogRef = this.dialog.open(InputDialogComponent, {
        height: '300px',
        width: '500px',
        data: {
          title: "Named graph URI", 
          description: "Type the name of the named graph to which the dataset should be loaded.",
          inputText: "URI"}
      });
  
      dialogRef.afterClosed().subscribe(uri => {
        this.loadDataset(uri);
      });
  }

  showWipeNamed(){
    this._ss.getNamedGraphs().subscribe(namedGraphs => {

      let dialogRef = this.dialog.open(SelectDialogComponent, {
        height: '300px',
        width: '500px',
        data: {
          title: "Named graph URI", 
          description: "Select the named graph you wish to wipe",
          selectText: "named graph",
          list: namedGraphs}
      });
  
      dialogRef.afterClosed().subscribe(ng => {
        this.wipeDB(ng);
      });

    });
  }

  loadDataset(namedGraph?){
    // Get filePath if a source is defined
    this._ds.getProjectSettings().subscribe(settings => {

      if(settings && settings.filePath){
        // Load from external source
        var url = settings.filePath;
        if(!namedGraph){
          return this.loadExternal(url);
        }else{
          return this.loadExternal(url,namedGraph);
        }

      }else{
        // Load user defined triples
        const triples = this.triples;

        this._ss.loadTriples(triples, namedGraph)
          .subscribe(res => {
            if(res.status == '200'){
              this.showSnackbar("Successfully loaded dataset");
              // this.doQuery();
            }else{
              this.showSnackbar(res.status+': '+res.statusText);
              console.log(res);
            }
          }, err => {
            this.showSnackbar("Something went wrong");
            console.log(err);
          })

      }
    });
  }

  wipeDB(namedGraph?){
    this._ss.wipeDB(namedGraph)
      .subscribe(res => {
        if(res.status == '200'){
          this.showSnackbar("Successfully wiped database");
        }else{
          this.showSnackbar(res.status+': '+res.statusText);
          console.log(res);
        }
      }, err => {
        this.showSnackbar("Something went wrong");
        console.log(err);
      })
  }

  loadOntologies(){
    var url = "https://w3id.org/bot";
    var namedGraph = "https://bot";
    this.loadExternal(url,namedGraph);
  }

  loadExternal(url,namedGraph?){
    this._ds.setLoaderStatus(true);
    this._ds.setLoadingMessage("Downloading triples from external source");

    this._ss.getTriplesFromURL(url)
      .subscribe(res => {

        this._ds.setLoadingMessage("Loading triples in store");
        this._ss.loadTriples(res.body, namedGraph)
          .subscribe(res => {
            this._ds.setLoaderStatus(false);
            if(res.status == '200' || res.status == '201'){
              this.showSnackbar("Successfully loaded triples in store");
              // this.doQuery();
            }else{
              this.showSnackbar(res.status+': '+res.statusText);
              console.log(res);
            }
          }, err => {
            this.showSnackbar("Something went wrong");
            this._ds.setLoaderStatus(false);
            console.log(err);
          })

      }, err => {
        this._ds.setLoaderStatus(false);
        this.showSnackbar('Could not load content from '+url);
      });
  }

  showSnackbar(message, duration?){
    if(!duration) duration = 2000
    this.snackBar.open(message, 'close', {
      duration: duration,
    });
  }

}
