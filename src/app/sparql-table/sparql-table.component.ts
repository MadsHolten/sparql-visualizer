import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import * as N3 from 'n3';
import * as _ from 'lodash';
import 'rxjs/add/observable/of';

import { DataService } from '../services/data.service';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'sparql-table',
  styleUrls: ['sparql-table.component.css'],
  templateUrl: 'sparql-table.component.html',
  providers: [DataService]
})

export class SparqlTableComponent implements OnChanges, OnInit{

  displayedColumns;
  dataSource;
  resultLength: number;
  prefixes: object;
  @Input() queryResult: Object;

  constructor(
    private ds: DataService
  ){}

  ngOnInit(){
    this.ds.getPrefixes().subscribe(res => {
      this.prefixes = res;
    })
  }

  ngOnChanges(changes: SimpleChanges){
    // If a result has been returned
    if(changes.queryResult.currentValue && changes.queryResult.currentValue.head && changes.queryResult.currentValue.head.vars.length > 0){

      //Extract columns
      this.displayedColumns = changes.queryResult.currentValue.head.vars;

      //Extract results
      var bindings = changes.queryResult.currentValue.results.bindings;

      //Abbreviate using prefixes
      this.ds.getPrefixes().subscribe(prefixes => {      
        data = _.map( bindings, i => _.mapValues(i, j => {
          if(j.type == 'uri'){
            var abbreviated = this._abbreviate(j.value,prefixes);
            return abbreviated ? abbreviated : j.value;
          }else{
            return j.value;
          }
        }) );
        this.resultLength = data.length;

        //Load data source
        this.dataSource = new ExampleDataSource();
      })
      
    // If no result has been returned
    }else{
      this.displayedColumns = [];
      data = [];
      this.resultLength = data.length;
      //Load data source
      this.dataSource = new ExampleDataSource();
    }
  }

  private _abbreviate(foi,prefixes){
    var newVal: string;
    // Loop over prefixes
    _.each(prefixes, p => {
      var prefix = p.prefix;
      var uri = p.uri;
      if(foi.indexOf(uri) !== -1){
        newVal = foi.replace(uri, prefix+':');
      }
    })
    return newVal;
  } 

}

var data: Object[] = [
  {g: 'tag:/Revit_testprojekt.rvt.ttl', o: 'Generic -450mm', p: 'http://www.w3.org/2000/01/rdf-schema#label', s: 'https://localhost/0001/Walls/9499a8c6-2e95-4531-b828-c64330c19895'},
  {g: 'tag:/Revit_testprojekt.rvt.ttl', o: 'https://w3id.org/bot#Element', p: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', s: 'https://localhost/0001/Walls/9499a8c6-2e95-4531-b828-c64330c19895'}
];

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Object[]> {
    return Observable.of(data);
  }

  disconnect() {}
}