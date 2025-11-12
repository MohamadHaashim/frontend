import { Injectable } from '@angular/core';
import { ServiceProvider } from '../service.provider';
import { map } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServiceConfig } from '../service.url.config';
@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  fileName = '';
  schooluploadUrls=this.service.services.fileUploadSchool.url;
  schoolupdateUrls=this.service.services.fileUpdateSchool.url;
  adminupdateUrls=this.service.services.fileUpdateAdmin.url;
  adminuploadUrls=this.service.services.fileUploadAdmin.url;
  constructor(
    private dataService: ServiceProvider,
    private http: HttpClient,
    public service:ServiceConfig
  ) {}

  public schoolCreate(requestPayload:{school_data: any, user_data: any}) {
    return this.dataService.post('schoolCreate', requestPayload).pipe(
      map((response) => {
        return response;
      })
    );
  }
  public schoolList(data: any) {
    return this.dataService.post('schoolList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public schoolNameList() {
    return this.dataService.get('schoolNameList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public schoolGet(data: any) {
    return this.dataService.get('schoolGet', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public schoolUpdate(studentId: any) {
    return this.dataService.put('schoolUpdate', studentId).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public schoolDelete(studentId: any) {
    return this.dataService.delete('schoolDelete', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
//FileschoolDelete
public fileDeleteSchool(studentId: any) {
  return this.dataService.delete('fileDeleteSchool', studentId).pipe(
    map((data) => {
      console.log(data);
      return data;
    })
  );
}
//FileadminDelete
public fileDeleteAdmin(userId: any) {
  return this.dataService.delete('fileDeleteAdmin', userId).pipe(
    map((data) => {
      console.log(data);
      return data;
    })
  );
}

  public fileUploadSchool(file: File): Observable<HttpEvent<any>> {    
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const req = new HttpRequest('POST', this.schooluploadUrls, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
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

  public fileUpdateSchool(file: File, schoolId: string): Observable<HttpEvent<any>> {    
    this.fileName = file.name;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('school_id', schoolId);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const req = new HttpRequest('POST', this.schoolupdateUrls, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  public fileUpdateAdmin(file: File, userId: string): Observable<HttpEvent<any>> {    
    this.fileName = file.name;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const req = new HttpRequest('POST', this.adminupdateUrls, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}
