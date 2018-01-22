import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/observable/of';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'sparql-table',
  styleUrls: ['sparql-table.component.css'],
  templateUrl: 'sparql-table.component.html'
})

export class SparqlTableComponent implements OnChanges{

  @Input() queryResult: Object;

  ngOnChanges(changes: SimpleChanges){
    // If a result has been returned
    if(changes.queryResult.currentValue && changes.queryResult.currentValue.head && changes.queryResult.currentValue.head.vars.length > 0){
      
      //Extract columns
      this.displayedColumns = changes.queryResult.currentValue.head.vars;

      //Extract results
      var bindings = changes.queryResult.currentValue.results.bindings;
      data = _.map( bindings, i => _.mapValues(i, j => j.value) );

      //Get number of results
      this.resultLength = data.length;

      //Load data source
      this.dataSource = new ExampleDataSource();
    
    // If no result has been returned
    }else{
      this.displayedColumns = [];
      data = [];
      this.resultLength = data.length;
      //Load data source
      this.dataSource = new ExampleDataSource();
    }
  }

  displayedColumns;
  dataSource;
  resultLength: number;

  // displayedColumns = ['g', 's', 'p', 'o'];
  // dataSource = new ExampleDataSource();
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