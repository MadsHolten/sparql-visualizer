import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser'; // To override title

import { QueryService } from './services/query.service';
import { DataService, TabsData, ProjectData } from './services/data.service';
import { StardogService } from './services/stardog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ QueryService, DataService, StardogService ]
})
export class AppComponent implements OnInit {

  private queryResult;
  private resultFieldExpanded: boolean = false;
  public tabIndex: number;
  public showJSON: boolean = false;
  public editDescription: boolean = false; // true if in edit mode
  public newDescription: string; // Holds description changes
  public tabTitles: string[];
  public data: TabsData;
  public projectData: ProjectData;
  public queryType: string;
  public reasoning: boolean;

  public loading: boolean;
  public loadingMessage: string;

  // Triplestore can easily be disabled
  public triplestoreOption: boolean = true;

  // Toggle store
  public localStore: boolean = true;
  public toggleTooltip: string = 'Switch to triplestore';

  constructor(
    private _qs: QueryService,
    private _ds: DataService,
    private _ss: StardogService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit(){   
    this.route.queryParams.subscribe(map => {
      // If a tab is specified, use this. Else default to first tab
      this.tabIndex = map.tab ? parseInt(map.tab) : 0;

      // If triplestore mode is defined, use this
      this.localStore = map.local == 0 ? false : true;
      
      // Get tab titles
      this._ds.getTabTitles().subscribe(res => this.tabTitles = res);

      // Get project data
      this._ds.getProjectData().subscribe(res => {
        this.projectData = res;
        // Change page title
        this.titleService.setTitle(this.projectData.title);
      });

      this.changeTab(this.tabIndex);
    });
  
  }

  doQuery(){
    const query = this.data.query
    const data = this.data.triples;

    // Get the query type
    this.queryType = this._qs.getQuerytype(query);

    // If in localstore mode
    if(this.localStore){
      this.queryLocalstore(query,data);
    }
    // If in triplestore mode
    else{
      this.queryTriplestore(query);
    }

  }

  queryLocalstore(query,data){
    this._qs.doQuery(query,data)
      .then(res => {
        this.queryResult = res;
        this.resultFieldExpanded = true;
      }).catch(err => {
        console.log(err);
        if(err.message && err.name){
          this.showSnackbar(err.name+': '+err.message, 10000);
        }
      });
  }

  queryTriplestore(query){
    this._ss.query(query,this.reasoning)
      .subscribe(res => {
        // show error if status 200 was not recieved
        if(res.status != '200'){
          if(res.body && res.body.message){
            this.showSnackbar(res.body.code+': '+res.body.message, 10000);
          }else{
            this.showSnackbar(res.status+': '+res.statusText);
          }
          console.log(res);
        }else{

          // Get body content
          var data = res.body;

          if(data == null){
            // If it's an update query, it will not return a result. Just show snackbar
            this.showSnackbar("Query successful");

          // If it's a select query, just return the result as it is
          }else if(this.queryType == 'select'){
            this.queryResult = data;
            this.resultFieldExpanded = true;
          
          // If it's a construct query, parse it first
          }else{

            // To parse the result to the correct format, we run a query on it
            var query = "CONSTRUCT WHERE {?s ?p ?o}";
            this._qs.doQuery(query,data)
              .then(res => {
                if(res.length == 0){
                  this.queryResult = null;
                  this.showSnackbar("Query returned no results. Did you load the correct dataset?");
                }else{
                  this.queryResult = res;
                  this.resultFieldExpanded = true;
                }
              }, err => console.log(err));
          }
        }
    
      }, err => {
        this.showSnackbar("Something went wrong");
      });
  }

  resetTriples(){
    this._ds.getSingle(this.tabIndex)
        .subscribe(x => {
            this.data.triples = x.triples;
        });
  }

  resetQuery(){
    this._ds.getSingle(this.tabIndex)
    .subscribe(x => {
        this.data.query = x.query;
    });
  }

  toggleStore(){
    this.localStore = this.localStore == false ? true : false;
    this.toggleTooltip = this.toggleTooltip == 'Switch to datasets' ? 'Switch to triplestore' : 'Switch to datasets';
  }

  changeTab(i){
    if(i == 'new'){
      console.log('Add new dataset');
    }else{
      this.tabIndex = i;
      this._ds.getSingle(i)
        .subscribe(x => {
            this.data = x;
            //Perform the query if the tab has a query assigned
            if(this.data.query){
              this.doQuery();
            }else{
              this.queryResult = null;
            }
        });
    
    }
  }

  wipeDB(){
    const query = "DELETE WHERE { ?s ?p ?o }";

    this._ss.query(query)
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

  loadDataset(){
    // Get filePath if a source is defined
    this._ds.getProjectSettings().subscribe(settings => {

      if(settings && settings.filePath){
        // Load from external source
        var url = settings.filePath;
        return this.loadExternal(url);

      }else{

        // Load user defined triples
        const triples = this.data.triples;
        console.log(triples);
        this._ss.loadTriples(triples)
          .subscribe(res => {
            if(res.status == '200'){
              this.showSnackbar("Successfully loaded dataset");
              this.doQuery();
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

  showSnackbar(message, duration?){
    if(!duration) duration = 2000
    this.snackBar.open(message, 'close', {
      duration: duration,
    });
  }

  loadOntologies(){
    var url = "https://w3id.org/bot";
    var namedGraph = "https://bot";
    this.loadExternal(url,namedGraph);
  }

  loadExternal(url,namedGraph?){
    this.loading = true;
    this.loadingMessage = "Downloading triples from external source";
    this._ss.getTriplesFromURL(url)
      .subscribe(res => {

        this.loadingMessage = "Loading triples in store";
        this._ss.loadTriples(res.body, namedGraph)
          .subscribe(res => {
            this.loading = false;
            if(res.status == '200' || res.status == '201'){
              this.showSnackbar("Successfully loaded triples in store");
              this.doQuery();
            }else{
              this.showSnackbar(res.status+': '+res.statusText);
              console.log(res);
            }
          }, err => {
            this.showSnackbar("Something went wrong");
            console.log(err);
          })

      }, err => {
        this.loading = false;
        this.showSnackbar('Could not load content from '+url);
      });
  }

  saveDescription(){
    // If changes received
    if(this.newDescription){
      this.data.description = this.newDescription;
    }
    this.editDescription = false;
  }

  update(ev){
    console.log(ev);
  }

}
