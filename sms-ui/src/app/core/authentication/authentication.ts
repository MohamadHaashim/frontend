import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServiceProvider } from '../service/service.provider';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { ServiceConfig } from '../service/service.url.config';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    constructor(
      public dataService: ServiceProvider, 
      private toastr: ToastrService,
      private http: HttpClient,
      public service:ServiceConfig
    ) {
        this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(loginType: any, userName: any, userPassword: any) {
        const requestQuery = {
            loginType: loginType,
            userName: userName,
            password: userPassword
          };
        return this.dataService.post('login', requestQuery)
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user.body));
                this.currentUserSubject.next(user.body);
                return user.body;
            }));
    }

    forgotLogin(loginType: any, userName: any, userPassword: any) {
      const requestQuery = {
        loginType: loginType,
        userName: userName,
        password: userPassword
      };
      return this.dataService.post('forgotPasswordLogin', requestQuery)
        .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.body.responseData));
          this.currentUserSubject.next(user.body.responseData);
          return user.body;
        }));
    }
    
    //forgotPassword
    forgotPassword(user_name: any) {
      const requestQuery = {
        user_name: user_name,
      };
      return this.dataService.post('forgotPassword', requestQuery)
        .pipe(map(user => {
          return user.body;
        }));
    }
    //resetPassword
    resetPassword(token: string, newPassword: any, confirmPassword: any) {
      const requestQuery = {
        token: token, 
        newPassword: newPassword,
        confirmPassword: confirmPassword
      };
      
      return this.dataService.post(`resetPassword/+${token}`, requestQuery)
        .pipe(map(user => {
          return user.body;
        }));
    }
    
    logout() {
        // remove user from local storage to log user out
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        const bodyQuery = {
            token: currentUser.access_token
        };
        this.dataService.post('logout', bodyQuery).subscribe(data => {
            console.log('Logout successfully!');
        });
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return true;
    }

}