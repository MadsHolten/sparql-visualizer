import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';
import * as Hylar from 'hylar';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { Observable } from "rxjs/Observable";

export interface Qres {
  actions?;
  duplicates?: Object[];
  triples?: Triple[];
}

export interface Triple {
  subject: TripleComponent;
  predicate: TripleComponent;
  object: TripleComponent;
}

export interface TripleComponent {
  nominalValue;
}

export interface HylarConstruct {
  subject: string;
  predicate: string;
  object: string;
}

@Injectable()
export class QueryService {

  private store;
  private prefixesPromise;

  constructor( public http: HttpClient ) { }

  doHylarQuery(query,triples){

    var h = new Hylar();

    var saturateAndQuery = async (query,triples) => {

        var start = Date.now();
        var mimeType = "text/turtle";
        var keepOldValues = false;

        var saturation = await h.load(triples, mimeType, keepOldValues);
        if(!saturation) console.log('Graph saturation failed.');
    
        var res = await h.query(query);

        // Register query time
        var end = Date.now();
        var elapsed = (end-start)/1000;
        var message = `Returned ${res.length} triples in ${elapsed} seconds`;
        console.log(message);

        // Process result
        if(res.triples) res = res.triples;

        var queryType = this.getQuerytype(query);

        // Return JSON formatted results for SELECT queries
        if(queryType == 'select'){
            res = this.sparqlJSON(res).data;
        }
        // Return {subjext: "", predicate: "", object: ""} for CONSTRUCT queries
        else{
          res = _.map(res, x => _.mapValues<any>(x, y => y.nominalValue));
        }
    
        return res;
    
    }

    return Observable.fromPromise(saturateAndQuery(query,triples));
  }

  doQuery(query,triples,mimeType?){

    if(!mimeType) mimeType = 'text/turtle';

    // Get query type
    const queryType = this.getQuerytype(query);

    return this._createStore()
        .then(store => {
          this.store = store;
          this.prefixesPromise = this._getPrefixes(triples);
          return this._loadTriplesInStore(store, triples, mimeType);
        })
        .then(storeSize => {
          // console.log(storeSize);
          return this._executeQuery(this.store, query);
        })
        .then(res => {
          var data: Qres = res;
          
          // Reformat data if select query
          if(queryType == 'select'){
            return this.sparqlJSON(data).data;
          }

          /**
           * NB! THE PREFIXING SHOULD BE HANDLED BY A PIPE!
           */

          // Get prefixes
          return this.prefixesPromise.then(prefixes => {

            // Process result
            var triples = _.chain(data.triples).map(x => {
              var s = x.subject.nominalValue;
              var p = x.predicate.nominalValue;
              var o = x.object.nominalValue;

              // Abbreviate turtle format
              if(mimeType == 'text/turtle'){
                if(this._abbreviate(s,prefixes) != null) s = this._abbreviate(s,prefixes);
                if(this._abbreviate(p,prefixes) != null) p = this._abbreviate(p,prefixes);
                if(this._abbreviate(o,prefixes) != null) o = this._abbreviate(o,prefixes);
              }

              return {subject: s, predicate: p, object: o}
            }).value();
            
            return triples;

          })

        })

  }

  public getQuerytype(query){
    // Get index of select and construct
    var selIndex = query.toLowerCase().indexOf('select');
    var consIndex = query.toLowerCase().indexOf('construct');

    // If both are found in the string, take the one with the lowest index
    // That means that we can still allow someone to for instance query for
    // a string that has "select" in it
    if(selIndex != -1 && consIndex !=-1){
      return selIndex < consIndex ? 'select' : 'construct';
    }
    if(selIndex != -1) return 'select';
    if(consIndex != -1) return 'construct';
    // If it is an insert query or something else return null
    return null;
  }

  public sparqlJSON(data){
      // Get variable keys
      var vars = _.keysIn(data[0]);
      
      // check that it doesn't return null results
      if(data[0][vars[0]] == null){
          return {status: 400, data: "Query returned no results"};
      }

      // Flatten object array
      var b = _.flatMap(data);

      // Rename keys according to below mapping table
      var map = {
          token: "type",
          type: "datatype",
          lang: "xml:lang"
      };

      // Loop over data to rename the keys
      for(var i in b){
          for(var key in vars){
              b[i][vars[key]] = this._renameKeys(b[i][vars[key]], map)
          }
      }

      // Re-format data
      var reformatted = {head: {vars: vars}, results: {bindings: b}};

      return {status: 200, data: reformatted};
  }

  private _createStore(){
    return new Promise( (resolve, reject) => {
      rdfstore.create((err, store) => {
        if(err) reject(err);
        resolve(store);
      });
    })
  }

  private _loadTriplesInStore(store, triples, mimeType?){
    if(!mimeType) mimeType = 'text/turtle';
    return new Promise((resolve, reject) => {
        store.load(mimeType, triples, (err, size) => {
            if(err) reject(err);
            resolve(size);
        })
    })
  }

  private _executeQuery(store, query){
    return new Promise((resolve, reject) => {
        store.execute(query, (err, res) => {
            if(err) reject(err);
            resolve(res);
        })
    })
  }

  private _getPrefixes(triples){
    // ParseTriples
    var parser = N3.Parser();
    return new Promise( (resolve, reject) => {
        parser.parse(triples, (err, triple, prefixes) => {
          if(!triple){
            resolve(prefixes);
          }
          if(err){
            reject(err);
          }
        });
      }
    );
  }

  private _abbreviate(foi,prefixes){
    var newVal = null;
    // If FoI has 'http' in its name, continue
    if(foi.indexOf('http') !== -1){
      // Loop over prefixes
      _.each(prefixes, (val, key) => {
        // If the FoI has the prefixed namespace in its name, return it
        if(foi.indexOf(val) !== -1){
          newVal = foi.replace(val, key+':');
        }
      })
    }
    return newVal;
    
  }

  public _abbreviateTriples(triples,prefixes){

    var abrTriples = [];
      
    function abbreviate(foi){
      var newVal = null;
      // If FoI has 'http' in its name, continue
      if(foi.indexOf('http') !== -1){
        // Loop over prefixes
        _.each(prefixes, (val, key) => {
          // If the FoI has the prefixed namespace in its name, return it
          if(foi.indexOf(val) !== -1){
            newVal = foi.replace(val, key+':');
          }
        })
      }
      return newVal;
      
    }

    _.each(triples, d => {
      var s = d.subject;
      var p = d.predicate;
      var o = d.object;

      if(abbreviate(s) != null) s = abbreviate(s);
      if(abbreviate(p) != null) p = abbreviate(p);
      if(abbreviate(o) != null) o = abbreviate(o);
      abrTriples.push({subject: s, predicate: p, object: o})
    });
    return abrTriples;
  }

  private _renameKeys(obj, newKeys) {
      const keyValues = Object.keys(obj).map(key => {
          const newKey = newKeys[key] || key;
          return { [newKey]: obj[key] };
      });
      return Object.assign({}, ...keyValues);
  }

}
