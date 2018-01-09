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
  private tabIndex: number = 0;
  private tabTitles: string;
  public data;

  constructor(
    private _qs: QueryService,
    private _ds: DataService
  ) {}

  ngOnInit(){
    this.tabTitles = this._ds.getTitles();
    console.log(this._ds.getData());
  }

  doQuery(query,data){
    this._qs.doQuery(query,data)
      .then(res => {
        this.queryResult = res;
      }, err => console.log(err));
  }

  changeTab(i){
    if(i == 'new'){
      console.log('Add new dataset');
    }else{
      this.data = this._ds.getSingle(i);
      this.doQuery(this.data.query,this.data.triples);
    }
  }

  update(ev){
    console.log(ev);
  }

}
