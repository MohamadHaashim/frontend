import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu-bar',
  templateUrl: './side-menu-bar.component.html',
  styleUrls: ['./side-menu-bar.component.css'],
})
export class SideMenuBarComponent implements OnInit {
  currentUser: any;
  currentPath: string = '/admin/dashboard';
  loginUserRole: any = "Super Admin";
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log(event.url);
        this.currentPath = event.url;
      });
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log(this.currentUser);
  
    if (this.currentUser && this.currentUser.responseData && this.currentUser.responseData.userDetail) {
      this.loginUserRole = this.currentUser.responseData.userDetail.roles.roleName;
    } else {
      // Handle cases where userDetail or roleName might be undefined
      console.error('User details or role name not found.');
      return;
    }
  
    this.cdr.detectChanges();
    console.log('Logged in as:', this.loginUserRole);
  
  }
  
}
