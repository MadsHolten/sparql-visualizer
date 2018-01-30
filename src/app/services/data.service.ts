import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import * as existsFile from 'exists-file';

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

    getData(path){
        return this.http.get<Data[]>(path);
    }

    getTitles(path){
        // Should check if file actually exists
        return this.http.get<Data[]>(path)
            .map(x => {
                return _.map(x, d => d.title);
            });
    }

    getSingle(path, index){
        return this.http.get<Data[]>(path)
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