import { Injectable } from '@angular/core';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as existsFile from 'exists-file';

export interface TabsData {
    title: string;
    description: string;
    triples: string;
    query: string;
}

export interface ProjectData {
    title: string;
    creator?: string;
}

export interface Data {
    project: ProjectData;
    tabs: TabsData[]
}

@Injectable()
export class DataService {

    constructor(
        public http: HttpClient
    ) { }

    getData(path){
        return this.http.get<any>(path);
    }

    getProjectData(path): Observable<ProjectData>{
        return this.http.get<any>(path)
            .map(x => {
                // Title only exists on new JSON
                if(this.isOldJSONFormat(x)){
                    return {title: "visualization"};
                }else{
                    var dataNew: Data = x;
                    return dataNew.project;
                }
            });
    }

    getTabTitles(path){
        // Should check if file actually exists
        return this.http.get<any>(path)
            .map(x => {
                // An extra level has been added to JSON file since first release
                // For backward support, a check is needed
                if(this.isOldJSONFormat(x)){
                    var dataOld: TabsData[] = x;
                    return _.map(dataOld, d => d.title);
                }else{
                    var dataNew: Data = x;
                    return _.map(dataNew.tabs, d => d.title);
                }
            });
    }

    getSingle(path, index){
        return this.http.get<any>(path)
            .map(x => {
                if(this.isOldJSONFormat(x)){
                    return x[index];
                }else{
                    return x.tabs[index];
                }                
            })
            .map(x => {
                var query = Array.isArray(x.query) ? x.query.join('\n') : x.query;
                var description = Array.isArray(x.description) ? x.description.join('\n') : x.description;
                var triples = Array.isArray(x.triples) ? x.triples.join('\n') : x.triples;
                var title = x.title;
                return {title: title, query: query, triples: triples, description: description};
            });
    }

    private isOldJSONFormat(data){
        if(Array.isArray(data)){
            return true;
        }else{
            return false;
        }
    }

}