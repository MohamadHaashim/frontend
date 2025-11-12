import { Injectable } from '@angular/core';
import { ServiceProvider } from '../service.provider';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private dataService: ServiceProvider) {}

  public addStudentPrimaryDetails(bodyParams: any) {
    return this.dataService.post('addStudentPrimaryDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addStudentPersonalDetails(bodyParams: any) {
    return this.dataService.post('addStudentPersonalDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addStudentContactDetails(bodyParams: any) {
    return this.dataService.post('addStudentContactDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addStudentEducationDetails(bodyParams: any) {
    return this.dataService.post('addStudentEducationDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addStudentCourseDetails(bodyParams: any) {
    return this.dataService.post('addStudentCourseDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addStudentOtherDetails(bodyParams: any) {
    return this.dataService.post('addStudentOtherDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public getStudentList(data: any) {
    return this.dataService.post('getStudentList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public searchForStudent(bodyParams: any) {
    return this.dataService.post('searchForStudent', bodyParams).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getStudentSinglePrimaryData(studentId: any) {
    return this.dataService.get('getStudentSinglePrimaryData', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getStudentProfileDetails(studentId: any) {
    return this.dataService.get('getStudentProfileDetails', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getStudentContactDetails(studentId: any) {
    return this.dataService.get('getStudentContactDetails', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getStudentEducationDetails(studentId: any) {
    return this.dataService.get('getStudentEducationDetails', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getStudentCourseDetails(studentId: any) {
    return this.dataService.get('getStudentCourseDetails', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getStudentOtherDetails(studentId: any) {
    return this.dataService.get('getStudentOtherDetails', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public deleteStudent(studentId: any) {
    return this.dataService.delete('deleteStudent', studentId).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
}
