import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Connection, query, db, HTTP } from 'stardog';
import { HttpClient } from '@angular/common/http';

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

    query(q,reasoning?){
        if(!reasoning) reasoning = false;
        const conn = this._getConn();
        const database = this._getDB();
        return Observable.fromPromise(
            query.execute(conn, database, q, undefined, {reasoning: reasoning})
            // query.execute(conn, database, q)
        );
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