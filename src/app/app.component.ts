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
  providers: [ QueryService, StardogService ]
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
  public queryTime: number;

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

    // Inject shared services
    this._ds.loadingStatus.subscribe(loading => this.loading = loading);
    this._ds.loadingMessage.subscribe(msg => this.loadingMessage = msg);
  }
  
  changeMsg(){
    this._ds.setLoadingMessage("Loading triples in store");
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

  log(ev){
    console.log(ev);
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
    var t1 = Date.now();
    this._ss.query(query,this.reasoning)
      .subscribe(res => {
        // show error if status 200 was not recieved
        if(res.status != '200'){

          if(res.body && res.body.message){
            this.showSnackbar(res.body.code+': '+res.body.message, 10000);
          }else{
            this.showSnackbar(res.status+': '+res.statusText);
          }

        }else{
          var dt = Date.now()-t1;
          this.queryTime = dt;

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

  tableClick(URI){
    if(this.localStore){
      var query = `SELECT * WHERE {\n\tBIND(<${URI}> AS ?el)\n\t?el ?key ?value\n}`;
    }else{
      var query = `SELECT *\nWHERE {\n\tBIND(<${URI}> AS ?el)\n\tOPTIONAL { \n\t\tGRAPH ?graph {\n\t\t\t?el ?key ?value .\n\t\t}\n\t}\n\tOPTIONAL { ?el ?key ?value . }\n}`;
    }
    this.data.query = query;
    this.doQuery();
  }

  graphClick(URI){
    console.log(URI);
  }

  showSnackbar(message, duration?){
    if(!duration) duration = 2000
    this.snackBar.open(message, 'close', {
      duration: duration,
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
