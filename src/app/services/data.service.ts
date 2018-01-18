import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

export interface Data {
    title: string;
    description: string;
    triples: string;
    query: string;
}

@Injectable()
export class DataService {

    constructor(
        public http: HttpClient
    ) { }

    getData(){
        return this.http.get<Data[]>("./assets/data.json");
    }

    getTitles(){
        return this.http.get<Data[]>("./assets/data.json")
            .map(x => {
                return _.map(x, d => d.title);
            });
    }

    getSingle(index){
        return this.http.get<Data[]>("./assets/data.json")
            .map(x => {
                return x[index];
            })
            .map(x => {
                var query = Array.isArray(x.query) ? x.query.join('\n') : x.query;
                var description = Array.isArray(x.description) ? x.description.join('\n') : x.description;
                var triples = Array.isArray(x.triples) ? x.triples.join('\n') : x.triples;
                var title = x.title;
                return {title: title, query: query, triples: triples, description: description};
            });
    }

}