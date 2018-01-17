import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'ngx-store';

import { ProjectSettingsService } from './project-settings.service';

@Injectable()
export class TriplestoreService  extends ProjectSettingsService {

  private endpoint: string;

  constructor(
    public lss: LocalStorageService,
    public http: HttpClient
  ) { 
    super(lss);
    this.endpointSettings = this.getTriplestoreSettings();
    this.endpoint = this.endpointSettings.endpoint;
    if(!this.endpoint.endsWith('/')) this.endpoint = this.endpoint+'/';
  }

  public getQuery(query, reasoning?, queryType?){

    var options;

    // define search parameters
    var params = new HttpParams()
      .set('query', query);
    
    options = {params: params};

    // perform reasoning?
    if(reasoning){
      params.set('reasoning', 'true');
    }

    // query type
    if(queryType == 'construct'){
      var headers = new HttpHeaders()
        .set('Accept', 'application/ld+json');
      options = {params: params, headers: headers};
    }

    console.log(options);

    return this.http.get(this.endpoint+'query', options);

  }

  public updateQuery(query,baseURI?){
    
    // define search parameters
    var params = new HttpParams()
      .set('query', query);
    
    if(baseURI){
      params.set('baseURI', baseURI);
    }

    // update queries simply response with text
    var headers = new HttpHeaders()
      .set('Accept', 'text/boolean');

    // set options
    // NB! responsetype is necessary as Angular tries to
    // convert to JSON if not set
    var options = {
      params: params, 
      headers: headers, 
      responseType: 'text' as 'text',
      observe: 'response' as 'response'
    }

    return this.http.get(this.endpoint+'update', options);

  }

}