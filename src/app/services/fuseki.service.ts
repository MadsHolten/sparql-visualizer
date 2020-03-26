import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectSettingsService } from './project-settings.service';
import * as urljoin from 'url-join';

@Injectable()
export class FusekiService {

    private tss;
    private auth;

    constructor(
        private _http: HttpClient
    ){}

    // NB! BLOCKED DUE TO CORS POLICY
    createNewDataset(host, user?, pass?){

        const url = urljoin(host, '$', 'datasets');

        const dsName = "SPARQL-viz"

        const assemblerFile = `@prefix :      <http://base/#> .
        @prefix tdb:   <http://jena.hpl.hp.com/2008/tdb#> .
        @prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
        @prefix ja:    <http://jena.hpl.hp.com/2005/11/Assembler#> .
        @prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
        @prefix fuseki: <http://jena.apache.org/fuseki#> .
        
        :service_tdb_all
                a                                       fuseki:Service ;
                rdfs:label                              "TDB ${dsName}" ;
                fuseki:dataset                          :tdb_dataset_readwrite ;
                fuseki:name                             "${dsName}" ;
                fuseki:endpoint [ 
                    fuseki:operation fuseki:query ; 
                    fuseki:name "sparql"
                ] , [
                    fuseki:operation fuseki:query ; 
                    fuseki:name "query"
                ] , [
                    fuseki:operation fuseki:shacl ;
                    fuseki:name "shacl" 
                ] , [
                    fuseki:operation fuseki:update ; 
                    fuseki:name "update" 
                ] , [
                    fuseki:operation fuseki:gsp-r ; 
                    fuseki:name "get" 
                ] , [
                    fuseki:operation fuseki:gsp-rw ; 
                    fuseki:name "data"
                ] , [ 
                    fuseki:operation fuseki:upload ;
                    fuseki:name "upload"
                ] .
        
        :tdb_dataset_readwrite
                a                                       ja:RDFDataset ;
                ja:defaultGraph                         :tdb_dataset_reasoning .
        
        :tdb_dataset_reasoning
                ja:baseModel                            :tdb_dataset_graph ;
                a                                       ja:InfModel ;
                ja:reasoner                             [
                    ja:reasonerURL <http://jena.hpl.hp.com/2003/OWLFBRuleReasoner>
                ] .
        
        :tdb_dataset_graph
                a                                       tdb:GraphTDB ;
                a                                       ja:Model ;
                tdb:location                            "/fuseki/databases/${dsName}" .`;
        
        let headers: any = {'Content-Type': 'text/turtle'};
        if(user && pass){
            const auth = `Basic ${window.btoa(user + ':' + pass)}`;
            headers['Authorization'] = auth;
        }

        const options: any = {observe: 'response', responseType: 'text', headers};

        return this._http.post(url, assemblerFile, options).toPromise();

    }

    // NB! BLOCKED DUE TO CORS POLICY
    getDatasets(host, user?,pass?){

        const url = urljoin(host, '$', 'datasets');

        let headers: any = {};
        if(user && pass){
            const auth = `Basic ${window.btoa(user + ':' + pass)}`;
            headers['Authorization'] = auth;
        }
        return this._http.get(url, {headers}).toPromise();

    }

}