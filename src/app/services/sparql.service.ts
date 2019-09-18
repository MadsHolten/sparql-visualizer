import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as urljoin from 'url-join';
import { ProjectSettingsService } from './project-settings.service';
import { StardogService } from './stardog.service';
import { QueryService } from './query.service';

export interface ProjectSettings {
  endpoint: string;
  username?: string;
  password?: string;
}

@Injectable()
export class SPARQLService {

    public endpoint: string;
    public updateEndpoint: string;
    public dataEndpoint: string;
    public auth: string;
    public triplestore: string;

    constructor(
        private _http: HttpClient,
        private _ps: ProjectSettingsService,
        private _ss: StardogService,
        private _qs: QueryService
    ){}

    getTriplestoreSettings(){
        const tss = this._ps.getTriplestoreSettings();
        this.endpoint = tss.endpoint;
        this.updateEndpoint = tss.updateEndpoint;
        this.dataEndpoint = tss.dataEndpoint;
        this.triplestore = tss.tripleStore.toLowerCase();
        this.auth = `Basic ${window.btoa(tss.username + ':' + tss.password)}`;
    }

    public getQuery(query, reasoning?, mimeType?): Promise<any>{

        this.getTriplestoreSettings();

        if(!mimeType){
            // Get query type
            const queryType = this._qs.getQuerytype(query);
            if(queryType == 'construct') mimeType = 'text/turtle';
        }

        if(this.triplestore == 'stardog'){
            return this._ss.query(query, reasoning);
        }

        // Default behavior is Fuseki

        var params: any = {query};
        var headers: any = {'Authorization': this.auth};
        var options: any = {headers};

        if(mimeType){
            params.mimeType = mimeType;
            options.responseType = 'text';
        }

        options.params = params;

        return this._http.get(this.endpoint, options).toPromise();
    }

    public updateQuery(query): Promise<any>{

        this.getTriplestoreSettings();

        if(this.triplestore == 'stardog'){
            return this._ss.query(query);
        }

        // Default behavior is Fuseki
        var headers: any = {'Authorization': this.auth, 'Content-Type': 'application/x-www-form-urlencoded'};
        var options: any = {observe: 'response', responseType: 'text', headers};

        const body = `update=${query}`;

        return this._http.post(this.updateEndpoint, body, options).toPromise();

    }

    public loadTriples(triples,graphURI?): Promise<any>{

        this.getTriplestoreSettings();

        if(!this.dataEndpoint) return new Promise((resolve, reject) => reject("No data endpoint provided!"));

        if(this.triplestore == 'stardog'){
            return this._ss.loadTriples(triples,graphURI).toPromise();
        }

        // Default behavior uses the Graph Store protocol
        // https://www.w3.org/TR/2013/REC-sparql11-http-rdf-update-20130321/#http-post

        var options = {
            params: {},
            headers: {
                'Content-type': 'text/turtle'
            }
        }

        // If a named graph is specified, set this parameter
        if(graphURI) options.params = {graph: graphURI};

        return this._http.post(this.dataEndpoint, triples, options).toPromise();
        
    }

    // Download triples from some external resource
    getTriplesFromURL(url): Promise<any>{

        var options = {
            responseType: 'text' as 'text', // responsetype is necessary as Angular tries to convert to JSON if not set
            observe: 'response' as 'response',
            headers: {
                Accept: 'text/turtle'
            }
        }

        return this._http.get(url, options).toPromise();
    }


    /**
     * QUERIES
     */

    wipeDB(namedGraph?){
        if(!namedGraph){
            var q = "DELETE WHERE { ?s ?p ?o }";
        }else{
            var q = `DELETE WHERE { Graph <${namedGraph}> { ?s ?p ?o }}`;
        }
        return this.updateQuery(q);
    }

    async getNamedGraphs(): Promise<any>{
        var q = 'SELECT DISTINCT ?g WHERE { GRAPH ?g { ?s ?p ?o}}';

        const res = await this.getQuery(q);

        return res.results.bindings.map(obj => {
            var x: any = obj;
            return x.g.value;
        });

    }

}