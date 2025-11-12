import { Injectable } from '@angular/core';
import { ServiceConfig } from '../service.url.config';
import { ServiceProvider } from '../service.provider';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminuploadUrls=this.service.services.fileUploadAdmin.url;
  constructor(
    private dataService: ServiceProvider,
    private http: HttpClient,
    public service:ServiceConfig
  ) { }
  public adminCreate(data: any) {
    return this.dataService.post('adminCreate', data).pipe(
      map((response) => {
        return response;
      })
    );
  }
  public adminList(data: any) {
    return this.dataService.post('adminList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public adminGet(data: any) {
    return this.dataService.get('adminGet', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public adminUpdate(adminId: any) {
    return this.dataService.put('adminUpdate', adminId).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public adminDelete(adminId: any) {
    return this.dataService.delete('adminDelete', adminId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public fileUploadAdmin(file: File): Observable<HttpEvent<any>> {    
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const req = new HttpRequest('POST', this.adminuploadUrls, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
