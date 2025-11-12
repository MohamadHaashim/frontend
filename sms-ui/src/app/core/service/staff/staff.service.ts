import { Injectable } from '@angular/core';
import { ServiceProvider } from '../service.provider';
import { map } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServiceConfig } from '../service.url.config';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  fileName = '';
  staffuploadUrl=this.service.services.fileUploadStaff.url;

  constructor(private dataService: ServiceProvider,
    public service:ServiceConfig,
    private http: HttpClient,
  ) {}

  public addStaffDetails(bodyParams: any) {
    return this.dataService.post('addStaffDetails', bodyParams).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getStaffDetails(bodyParams: any) {
    return this.dataService.get('getStaffList', bodyParams).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public editStaffDetails(id: any) {
    return this.dataService.put('getStaffUpdate', id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public deleteStaffDetails(id: any) {
    return this.dataService.delete('getStaffDelete', id).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  // Nationality Dropdown

  public nationalityClassDropdown() {
    return this.dataService.post('nationalityClassDropdown').pipe(
      map((data) => {
        return data;
      })
    );
  }

   // State Dropdown

   public stateClassDropdown() {
    return this.dataService.post('stateClassDropdown',).pipe(
      map((data) => {
        return data;
      })
    );
  }


  // public addStaffDetails(data: any) {
  //   return this.dataService.post('addStaffDetails', data).pipe(
  //     map((response) => {
  //       return response;
  //     })
  //   );
  // }

  // public editStaffDetails(bodyParams: any) {
  //   return this.dataService.post('editStaffDetails', bodyParams).pipe(
  //     map((data) => {
  //       return data;
  //     })
  //   );
  // }

  // Roles

  public assignRolesDetails(bodyParams: any) {
    return this.dataService.post('assignRolesDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public assignRolesDropdown() {
    return this.dataService.post('assignRolesDropdown').pipe(
      map((data) => {
        return data;
      })
    );
  }




  public assignSubjectsDetails(bodyParams: any) {
    return this.dataService.post('assignSubjectsDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public assignSectionsDetails(bodyParams: any) {
    return this.dataService.post('assignSectionsDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }


  public assignClassDetails(bodyParams: any) {
    return this.dataService.post('assignClassDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public assignSubjectDetails(bodyParams: any) {
    return this.dataService.post('assignSubjectDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public assignRoleDetails(bodyParams: any) {
    return this.dataService.post('assignRoleDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getStaffList(data: any) {
    return this.dataService.post('getStaffList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  // Staff List

  public staffList(data: any) {
    return this.dataService.post('staffList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public searchForStaff(bodyParams: any) {
    return this.dataService.post('searchForStudent', bodyParams).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public deleteStaff(studentId: any) {
    return this.dataService.delete('deleteStaff', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  
//FileUploadStaff
  public fileUploadStaff(file: File): Observable<HttpEvent<any>> {    
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const req = new HttpRequest('POST', this.staffuploadUrl, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

// FileUpdateStaff
public fileUpdateSchool(file: File, schoolId: string): Observable<HttpEvent<any>> {    
  this.fileName = file.name;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('school_id', schoolId);
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const req = new HttpRequest('POST', this.staffuploadUrl, formData, {
    headers: headers,
    reportProgress: true,
    responseType: 'json'
  });

  return this.http.request(req);
}


}




