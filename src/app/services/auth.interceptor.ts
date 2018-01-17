import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'ngx-store';

import { ProjectSettingsService } from './project-settings.service';

@Injectable()
export class AuthInterceptor extends ProjectSettingsService implements HttpInterceptor {

    private auth;

    constructor(
        public lss: LocalStorageService
        ) { 
        super(lss);
        this.endpointSettings = this.getTriplestoreSettings();
        this.auth = "Basic "+btoa(this.endpointSettings.username + ":" + this.endpointSettings.password)
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
        setHeaders: {
            'Accept'       : 'application/sparql-results+json',
            'Authorization': this.auth
        },
        });

        return next.handle(req);
    }
}