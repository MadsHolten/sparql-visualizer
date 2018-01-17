import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { Connection, query, db, HTTP } from 'stardog';
import * as jsonld from 'jsonld';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { ProjectSettingsService } from './project-settings.service';

@Injectable()
export class StardogService  extends ProjectSettingsService {
    
    constructor(
        public lss: LocalStorageService
    ) { 
        super(lss);
    }

    loadTriples(triples){
        // const data = this._toJSONLD(triples)
        const conn = this._getConn();
        const database = this._getDB();
        // const mimeType = HTTP.RdfMimeType.TURTLE;
        return Observable.fromPromise(
            // this._toJSONLD(triples).then(data => {
            //     console.log(data);
            // })
            db.graph.doPut(conn, database, triples, '', 'text/turtle')
        );
        // return Observable.fromPromise(db.graph.doGet(this.conn, 'test'));
    }

    query(q){
        const conn = this._getConn();
        const database = this._getDB();
        return Observable.fromPromise(
            query.execute(conn, database, q)
        );
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

    private _toJSONLD(triples, mimeType?){
        // if(!mimeType) mimeType = '';
        return new Promise((resolve, reject) => {
            jsonld.fromRDF(triples, {format: 'application/nquads'}, (err, doc) => {
                if(err) reject(err);
                resolve(doc);
            });
        })
    }

}