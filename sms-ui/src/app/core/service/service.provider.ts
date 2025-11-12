import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { ServiceConfig } from './service.url.config';
import { Logger } from '../log/logger';
import { LocalStorageService } from 'angular-web-storage';
import { Observable } from 'rxjs';
interface urlEndPoint {
  endPoint: string;
}

@Injectable()
export class ServiceProvider {
  localUrl = '';
  serviceUrl: any;
  serviceEndPoint: any;
  autherizationStatus: any;
  constructor(
    private logger: Logger,
    private http: HttpClient,
    private serviceConfig: ServiceConfig,
    public local: LocalStorageService
  ) {}

  // Http Headers
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response',
  };

  get(endPoint?: string, queryParams?: any): Observable<any> {
    this.serviceEndPoint = this.serviceConfig.services;
    this.httpOptions.params = new HttpParams();
    if (endPoint) {
      this.serviceUrl = this.serviceEndPoint[endPoint].url;
      this.autherizationStatus = this.serviceEndPoint[endPoint].autherization;
    }
    if (queryParams !== undefined || queryParams != null) {
      this.serviceUrl = this.replaceRouteParams(this.serviceUrl, queryParams);
    }
    if (this.autherizationStatus) {
      const getCurUser = localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : '';
      if (getCurUser) {
        const currentUser = JSON.parse(getCurUser);
        const token = 'Bearer ' + currentUser.responseData.token;
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          token
        );
      }
    } else {
      this.httpOptions.headers.delete('Authorization');
    }
    return this.http.get(this.serviceUrl, this.httpOptions);
  }
  post(endPoint?: string, body?: any, p0?: { reportProgress: boolean; observe: string; }): Observable<any> {
    this.serviceEndPoint = this.serviceConfig.services;
    this.httpOptions.params = new HttpParams();
    if (endPoint) {
      this.serviceUrl = this.serviceEndPoint[endPoint].url;
      this.autherizationStatus = this.serviceEndPoint[endPoint].autherization;
    }
    this.httpOptions.params = new HttpParams();

    if (this.autherizationStatus) {
      const getCurUser = localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : '';
      if (getCurUser) {
        const currentUser = JSON.parse(getCurUser);
        const token = 'Bearer ' + currentUser.responseData.token;
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          token
        );
      }
    } else {
      this.httpOptions.headers.delete('Authorization');
    }
    return this.http.post(this.serviceUrl, body, this.httpOptions);
  }

  put(endPoint?: string, body?: any): Observable<any> {
    this.serviceEndPoint = this.serviceConfig.services;
    this.httpOptions.params = new HttpParams();
    if (endPoint) {
      this.serviceUrl = this.serviceEndPoint[endPoint].url;
      this.autherizationStatus = this.serviceEndPoint[endPoint].autherization;
    }
    this.httpOptions.params = new HttpParams();

    if (this.autherizationStatus) {
      const getCurUser = localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : '';
      if (getCurUser) {
        const currentUser = JSON.parse(getCurUser);
        const token = 'Bearer ' + currentUser.responseData.token;
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          token
        );
      }
    } else {
      this.httpOptions.headers.delete('Authorization');
    }
    return this.http.put(this.serviceUrl, body, this.httpOptions);
  }

  delete(endPoint?: string, queryParams?: any): Observable<any> {
    this.serviceEndPoint = this.serviceConfig.services;
    this.httpOptions.params = new HttpParams();
    console.log("DEL end point ");
    console.log("end poind: ", endPoint);
    console.log("query params: ", queryParams);
    console.log("obs: ", Observable);
    console.log("service end poind : ", this.serviceEndPoint);
    console.log("http params : ", this.httpOptions);
    if (endPoint) {
      this.serviceUrl = this.serviceEndPoint[endPoint].url;
      this.autherizationStatus = this.serviceEndPoint[endPoint].autherization;
    }
    if (queryParams !== undefined || queryParams != null) {
      this.serviceUrl = this.replaceRouteParams(this.serviceUrl, queryParams);
    }
    if (this.autherizationStatus) {
      const getCurUser = localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : '';
      if (getCurUser) {
        const currentUser = JSON.parse(getCurUser);
        const token = 'Bearer ' + currentUser.responseData.token;
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          token
        );
      }
    } else {
      this.httpOptions.headers.delete('Authorization');
    }
    return this.http.delete(this.serviceUrl, this.httpOptions);
  }


  upload(endPoint?: string, formData?: any) {
    this.serviceEndPoint = this.serviceConfig.services;
    this.httpOptions.params = new HttpParams();
    if (endPoint) {
      this.serviceUrl = this.serviceEndPoint[endPoint].url;
      this.autherizationStatus = this.serviceEndPoint[endPoint].autherization;
    }
    this.httpOptions.params = new HttpParams();
    if (this.autherizationStatus) {
      const getCurUser = localStorage.getItem('currentUser')
        ? localStorage.getItem('currentUser')
        : '';
      if (getCurUser) {
        const currentUser = JSON.parse(getCurUser);
        const token = 'Bearer ' + currentUser.responseData.token;
        this.httpOptions.headers = this.httpOptions.headers.set(
          'Authorization',
          token
        );
      }
    } else {
      this.httpOptions.headers.delete('Authorization');
    }
    return this.http.post<any>(this.serviceUrl, formData, this.httpOptions);
  }

  private replaceRouteParams(serviceUrl: any, routeParams: any) {
    for (const i in routeParams) {
      if (routeParams) {
        serviceUrl = serviceUrl.replace(
          ':' + i,
          routeParams[i].toString().replace(/[\s]/g, '')
        );
      }
    }
    return serviceUrl;
  }
}
