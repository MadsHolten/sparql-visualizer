import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Connection, query, db, HTTP } from 'stardog';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { ProjectSettingsService } from './project-settings.service';

@Injectable()
export class StardogService  extends ProjectSettingsService {
    
    constructor(
        public lss: LocalStorageService,
        public http: HttpClient
    ) { 
        super(lss);
    }

    loadTriples(triples,graphURI?){
        if(!graphURI) graphURI = undefined;
        // const data = this._toJSONLD(triples)
        const conn = this._getConn();
        const database = this._getDB();

        // const mimeType = HTTP.RdfMimeType.TURTLE;
        return Observable.fromPromise(
            db.graph.doPut(conn, database, triples, graphURI, 'text/turtle')
        );
        // return Observable.fromPromise(db.graph.doGet(this.conn, 'test'));
    }

    query(q,reasoning?): Observable<any>{
        if(!reasoning) reasoning = false;
        const conn = this._getConn();
        const database = this._getDB();
        return Observable.fromPromise(
            query.execute(conn, database, q, undefined, {reasoning: reasoning})
            // query.execute(conn, database, q)
        );
    }

    getNamedGraphs(): Observable<any>{
        var q = 'SELECT DISTINCT ?g WHERE { GRAPH ?g { ?s ?p ?o}}';
        return this.query(q).map(res => {
            if(res.status == '200'){
                return _.map(res.body.results.bindings, obj => {
                    var x: any = obj;
                    return x.g.value;
                });
            }
            return null;
        });
    }

    wipeDB(namedGraph?){
        if(!namedGraph){
            var q = "DELETE WHERE { ?s ?p ?o }";
        }else{
            var q = `DELETE WHERE { Graph <${namedGraph}> { ?s ?p ?o }}`;
        }
        return this.query(q);
    }

    getTriplesFromURL(url){
        // set options
        // NB! responsetype is necessary as Angular tries to
        // convert to JSON if not set
        var options = {
            responseType: 'text' as 'text',
            observe: 'response' as 'response'
        }

        return this.http.get(url, options);
    }

    private _getConn(){
        const settings = this.getTriplestoreSettings();

        return new Connection({
            username: settings.username,
            password: settings.password,
            endpoint: settings.endpoint
        });
    }

    private _getDB(){
        return this.getTriplestoreSettings().database;
    }

}