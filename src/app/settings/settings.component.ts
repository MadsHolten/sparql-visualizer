import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';

// Services
import { ProjectSettingsService } from '../services/project-settings.service';
import { DataService } from '../services/data.service';

// Dialogs
import { InputDialogComponent } from '../dialogs/input-dialog.component';
import { SelectDialogComponent } from '../dialogs/select-dialog.component';
import { SPARQLService } from '../services/sparql.service';

export interface ProjectSettings {
  endpoint: string;
  tripleStore: string;
  updateEndpoint?: string;
  dataEndpoint?: string;
  database?: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [ ProjectSettingsService, SPARQLService ]
})
export class SettingsComponent implements OnInit, OnChanges {

  panelOpenState: boolean = false;
  projectSettings: ProjectSettings = {endpoint: '', tripleStore: ''};
  loading: boolean;
  loadingMessage: string;

  triplestoreOptions = ['Fuseki', 'Stardog'];

  @Input() triples: string;

  constructor(
    private _pss: ProjectSettingsService,
    private _ss: SPARQLService,
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
      this.projectSettings.endpoint = "http://localhost:3030/db/query"; //default
      this.projectSettings.updateEndpoint = "http://localhost:3030/db/update"; //default
      this.projectSettings.dataEndpoint = "http://localhost:3030/db/data"; //default
      this.projectSettings.tripleStore = "Fuseki"; //default
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
        if(uri){
          this.loadDataset(uri);
        }
      });
  }

  async showWipeNamed(){

    // Get list of named graphs
    const namedGraphs = await this._ss.getNamedGraphs();
    
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
      if(ng){
        this.wipeDB(ng);
      }
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

        try{
          this._ss.loadTriples(triples, namedGraph);
        }catch(err){
          this.showSnackbar(err);
          console.log(err);
          return;
        }

        this.showSnackbar("Successfully loaded dataset");

      }
    });
  }

  async wipeDB(namedGraph?){

    try{
      this._ss.wipeDB(namedGraph);
      this.showSnackbar("Successfully wiped database");
    }catch(err){
      this.showSnackbar(err);
      console.log(err);
    }
    
  }

  loadOntologies(){
    var url = "https://w3c-lbd-cg.github.io/bot/bot.ttl";
    var namedGraph = "https://bot";
    this.loadExternal(url,namedGraph);
  }

  async loadExternal(url,namedGraph?){
    this._ds.setLoaderStatus(true);
    this._ds.setLoadingMessage("Downloading triples from external source");

    var triplesTTL;
    try{
      var res = await this._ss.getTriplesFromURL(url);
      triplesTTL = res.body;
    }catch(err){
      this._ds.setLoaderStatus(false);
      this.showSnackbar('Could not load content from '+url);
      return;
    }

    this._ds.setLoadingMessage("Loading triples in store");

    // Load triples in store
    try{
      await this._ss.loadTriples(triplesTTL, namedGraph);
    }catch(err){
      this.showSnackbar(err);
      this._ds.setLoaderStatus(false);
      console.log(err);
      return;
    }

    this._ds.setLoaderStatus(false);

    this.showSnackbar("Successfully loaded triples in store");
    
  }

  showSnackbar(message, duration?){
    if(!duration) duration = 2000
    this.snackBar.open(message, 'close', {
      duration: duration,
    });
  }

}
