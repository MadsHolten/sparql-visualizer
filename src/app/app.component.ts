import { Component, OnInit } from '@angular/core';

import { QueryService } from './query.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ QueryService, DataService ]
})
export class AppComponent implements OnInit {

  private queryResult;
  private resultFieldExpanded: boolean = false;
  private tabIndex: number = 0;
  public tabTitles: string;
  public data;

  constructor(
    private _qs: QueryService,
    private _ds: DataService
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

  update(ev){
    console.log(ev);
  }

}
