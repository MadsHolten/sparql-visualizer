import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';

export interface Qres {
  actions?;
  duplicates?: Object[];
  triples?: Object[];
}

@Injectable()
export class QueryService {

  private store;
  private prefixesPromise;

  constructor() { }

  doQuery(query,triples,mimeType?){

    if(!mimeType) mimeType = 'text/turtle';

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

  private _abbreviateTriples(triples,prefixes){

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

}
