import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { QueryService } from './services/query.service';
import { DataService } from './services/data.service';
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
  public data;

  // Toggle store
  public localStore: boolean = true;
  public toggleTooltip: string = 'Switch to triplestore';

  constructor(
    private _qs: QueryService,
    private _ds: DataService,
    private _ss: StardogService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(){
    this.tabTitles = this._ds.getTitles();
    this.changeTab(0);
  }

  doQuery(query,data){
    this._qs.doQuery(query,data)
      .then(res => {
        this.queryResult = res;
        this.resultFieldExpanded = true;
      }, err => console.log(err));
  }

  resetTriples(){
    let triples = this._ds.getSingle(this.tabIndex).triples;
    this.data.triples = triples;
  }

  resetQuery(){
    let query = this._ds.getSingle(this.tabIndex).query;
    this.data.query = query;
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
      let data = this._ds.getSingle(i);
      this.data = Object.assign({}, data);
      this.doQuery(this.data.query,this.data.triples);
    }
  }

  wipeDB(){
    const query = "DELETE WHERE { ?s ?p ?o }";

    this._ss.query(query)
      .subscribe(res => {
        console.log(res);
        if(res.status == '200'){
          this.showSnackbar("Successfully wiped database");
        }else{
          this.showSnackbar(res.status+': '+res.statusText);
        }
      }, err => {
        this.showSnackbar("Something went wrong");
      })
  }

  loadDataset(){
    const triples = this.data.triples;
    this._ss.loadTriples(triples)
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
  }

  showSnackbar(message){
    this.snackBar.open(message, 'close', {
      duration: 2000,
    });
  }

  update(ev){
    console.log(ev);
  }

}
