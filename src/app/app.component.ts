import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { QueryService } from './services/query.service';
import { DataService, Data } from './services/data.service';
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
  public tabIndex: number = 0;
  public tabTitles: string[];
  public data: Data;
  public queryType: string;
  public reasoning: boolean;
  private filePath: string = './assets/data.json';

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
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(){
    

    this.route.queryParams.subscribe(map => {
      // If a file path is specified, use this instead of the default
      if(map.file) this.filePath = map.file;

      // If a tab is specified, use this instead of the default
      if(map.tab) this.tabIndex = parseInt(map.tab);
      
      this._ds.getTitles(this.filePath).subscribe(res => {
        this.tabTitles = res;
      });

      this.changeTab(this.tabIndex);
    });
  
  }

  doQuery(){
    const query = this.data.query
    const data = this.data.triples

    // Get the query type
    this.queryType = this._qs.getQuerytype(query);

    // If in localstore mode
    if(this.localStore){
      this._qs.doQuery(query,data)
        .then(res => {
          this.queryResult = res;
          this.resultFieldExpanded = true;
        }, err => console.log(err));
    }
    // If in triplestore mode
    else{
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
            console.log("her")
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

  }

  resetTriples(){
    this._ds.getSingle(this.filePath, this.tabIndex)
        .subscribe(x => {
            this.data.triples = x.triples;
        });
  }

  resetQuery(){
    this._ds.getSingle(this.filePath, this.tabIndex)
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
      this._ds.getSingle(this.filePath, i)
        .subscribe(x => {
            this.data = x;
            this.doQuery();
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
    const triples = this.data.triples;
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

  showSnackbar(message, duration?){
    if(!duration) duration = 2000
    this.snackBar.open(message, 'close', {
      duration: duration,
    });
  }

  loadOntologies(){
    this._ss.getTriplesFromURL("https://w3id.org/bot")
      .subscribe(res => {
          this._ss.loadTriples(res.body, "https://bot")
            .subscribe(res => {
              if(res.status == '200' || res.status == '201'){
                console.log(res);
                this.showSnackbar("Successfully loaded BOT");
              }else{
                this.showSnackbar(res.status+': '+res.statusText);
                console.log(res);
              }
            }, err => {
              this.showSnackbar("Something went wrong");
              console.log(err);
            })
      });
  }

  update(ev){
    console.log(ev);
  }

}
