import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as rdfstore from 'rdfstore';
import * as _ from 'lodash';
import * as N3 from 'n3';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, DOCUMENT  } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as existsFile from 'exists-file';

//Services
import { ProjectSettingsService } from './project-settings.service';

export interface TabsData {
    title: string;
    description: string;
    triples: string;
    query: string;
    reasoning?: boolean;
    textOnly?: boolean;
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

    private filePath = './assets/data.json';
    private prefixPath = './assets/prefixes.json';

    constructor(
        public http: HttpClient,
        private route: ActivatedRoute,
        private pss: ProjectSettingsService,
        private sanitizer: DomSanitizer
    ) { }

    getPath(): Observable<string>{
        //Get URL parameters
        return this.route.queryParams.map(x => {
            // If a file path is specified, use this instead of the default
            var path = './assets/data.json';
            if(x.file){
                // convert improperly formatted dropbox link
                path = x.file.replace('www.dropbox', 'dl.dropboxusercontent');
            }

            return path;
        });
    }

    getProjectData(): Observable<ProjectData>{
        // First get file path from URL query parameter
        return this.getPath().mergeMap(path => {
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
        });
    }

    getProjectSettings(){
        // First get file path from URL query parameter
        return this.getPath().mergeMap(path => {
            return this.http.get<any>(path)
                .map(x => {
                    return x.settings ? x.settings : false;
                })
                .map(settings => {
                    if(!settings) settings = this.pss.getDataSettings();
                    return settings;
                });
        });
    }

    getTabTitles(): Observable<string[]>{
        // First get file path from URL query parameter
        return this.getPath().mergeMap(path => {
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
        });
    }

    getSingle(index): Observable<TabsData>{
        // First get file path from URL query parameter
        return this.getPath().mergeMap(path => {
            return this.http.get<any>(path)
                .map(x => {
                    if(this.isOldJSONFormat(x)){
                        return x[index];
                    }else{
                        return x.tabs[index];
                    }                
                })
                .map(x => {
                    x.query = Array.isArray(x.query) ? x.query.join('\n') : x.query;
                    x.description = Array.isArray(x.description) ? x.description.join('\n') : x.description;
                    x.triples = Array.isArray(x.triples) ? x.triples.join('\n') : x.triples;
                    return x;
                });
        });
    }

    getPrefixes(){
        return this.http.get<any>(this.prefixPath);
    }

    // SHARED SERVICES
    private loadingSource = new BehaviorSubject<boolean>(false);
    public loadingStatus = this.loadingSource.asObservable();

    setLoaderStatus(status: boolean){
        this.loadingSource.next(status);
    }

    private loadingMsgSource = new BehaviorSubject<string>("loading...");
    public loadingMessage = this.loadingMsgSource.asObservable();

    setLoadingMessage(msg: string){
        this.loadingMsgSource.next(msg);
    }

    private isOldJSONFormat(data){
        if(Array.isArray(data)){
            return true;
        }else{
            return false;
        }
    }

}