import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import * as N3 from 'n3';
import * as _ from 'lodash';
import 'rxjs/add/observable/of';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { DataService } from '../services/data.service';

import { SelectDialogComponent } from '../dialogs/select-dialog.component';

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
    private ds: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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

  showExportCsv(){

    let dialogRef = this.dialog.open(SelectDialogComponent, {
      height: '300px',
      width: '500px',
      data: {
        title: "Export to CSV", 
        description: "Please choose seperator",
        selectText: "seperator",
        list: [",", ";"]}
    });

    dialogRef.afterClosed().subscribe(separator => {
      this.exportCsv(separator);
    });

  }

  exportCsv(separator){

    // If ; used as separator, comma is used as decimal separator
    var decimalseparator = separator == ";" ? "," : ".";

    var options = { 
      fieldSeparator: separator,
      quoteStrings: '"',
      decimalseparator: decimalseparator,
      showLabels: true, 
      showTitle: false,
      useBom: true
    };

    var data = _.map(this.dataSource.data, x => {
      return _.mapValues(x, y => y.value);
    });
    
    new Angular2Csv(data, 'SPARQL-viz export', options);
  }

  showSnackbar(message, duration?){
    if(!duration) duration = 2000
    this.snackBar.open(message, 'close', {
      duration: duration,
    });
  }

}