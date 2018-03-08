import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import * as N3 from 'n3';
import * as _ from 'lodash';
import 'rxjs/add/observable/of';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { DataService } from '../services/data.service';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'sparql-table',
  styleUrls: ['sparql-table.component.css'],
  templateUrl: 'sparql-table.component.html'
})

export class SparqlTableComponent implements OnChanges, OnInit{

  displayedColumns;
  dataSource;
  resultLength: number;
  prefixes: object;
  showDatatypes: boolean = false;
  @Input() queryResult: Object;
  @Input() queryTime: Object;
  @Output() clickedURI = new EventEmitter<string>();

  // Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private ds: DataService
  ){}

  ngOnInit(){
    this.ds.getPrefixes().subscribe(res => {
      this.prefixes = res;
    })
  }
  
  /**
 * Set the paginator after the view init since this component will
 * be able to query its view for the initialized paginator.
 */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges){
    // If a result has been returned
    if(changes.queryResult.currentValue && changes.queryResult.currentValue.head && changes.queryResult.currentValue.head.vars.length > 0){

      //Extract columns
      this.displayedColumns = changes.queryResult.currentValue.head.vars;

      //Extract results
      var bindings = changes.queryResult.currentValue.results.bindings;

      var data: Element[] = bindings;

      this.resultLength = data.length;
      
    // If no result has been returned
    }else{
      this.displayedColumns = [];
      var data: Element[] = [];
      this.resultLength = data.length;
    }
    //Load data source
    this.dataSource = new MatTableDataSource<Element>(data);
    
    //Paginator
    this.dataSource.paginator = this.paginator;
  }

  clickElement(el){
    if(el.type == 'uri'){
      this.clickedURI.emit(el.value);
    }
  }

}