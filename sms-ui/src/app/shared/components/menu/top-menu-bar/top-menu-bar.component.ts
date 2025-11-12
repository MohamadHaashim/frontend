// import { Component, OnInit } from '@angular/core';
// import { AuthenticationService } from '../../../../core/authentication';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-top-menu-bar',
//   templateUrl: './top-menu-bar.component.html',
//   styleUrls: ['./top-menu-bar.component.css']
// })
// export class TopMenuBarComponent implements OnInit {
//   currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
//   loading = false;
//   submitted = false;
//   memberLoginStatus = false;
//   loginUserName:any;
//   constructor(
//     private router: Router,
//     private authenticationService: AuthenticationService,
//     private toastr: ToastrService,
//   ) { }

//   ngOnInit(): void {
//     this.loginUserName = this.currentUser.responseData.userDetail.name;
//   }
//   logout() {
//     this.submitted = true;
//     this.loading = true;
//     const logout = this.authenticationService.logout();
//     if (logout) {
//       this.memberLoginStatus = false;
//       this.toastr.success('Logged out successfully', 'Success');
//       this.router.navigate(['/login']);
//     } else {
//       this.toastr.error('Have issue with logout!', 'Failed');
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { AuthenticationService } from '../../../../core/authentication';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-top-menu-bar',
//   templateUrl: './top-menu-bar.component.html',
//   styleUrls: ['./top-menu-bar.component.css']
// })
// export class TopMenuBarComponent implements OnInit {
//   currentUser: any = {};  // Initialize as an empty object
//   loading = false;
//   submitted = false;
//   memberLoginStatus = false;
//   loginUserName: string | null = null;  // Use null to represent no value

//   constructor(
//     private router: Router,
//     private authenticationService: AuthenticationService,
//     private toastr: ToastrService,
//   ) { }

//   ngOnInit(): void {
//     // Retrieve the current user from localStorage
//     const storedUser = localStorage.getItem('currentUser');
//     if (storedUser) {
//       this.currentUser = JSON.parse(storedUser);
//       // Check if the responseData and userDetail exist before accessing them
//       if (this.currentUser.responseData && this.currentUser.responseData.userDetail) {
//         this.loginUserName = this.currentUser.responseData.userDetail.name;
//       } else {
//         console.warn('User detail is missing in currentUser');
//         this.loginUserName = 'Guest';  // Or some default value
//       }
//     } else {
//       console.warn('No user found in localStorage');
//       this.loginUserName = 'Guest';  // Or some default value
//     }
//   }

//   logout() {
//     this.submitted = true;
//     this.loading = true;
//     const logout = this.authenticationService.logout();
//     if (logout) {
//       this.memberLoginStatus = false;
//       this.toastr.success('Logged out successfully', 'Success');
//       this.router.navigate(['/login']);
//     } else {
//       this.toastr.error('Have issue with logout!', 'Failed');
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../core/authentication';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu-bar',
  templateUrl: './top-menu-bar.component.html',
  styleUrls: ['./top-menu-bar.component.css']
})
export class TopMenuBarComponent implements OnInit {
  currentUser: any = {};  // Initialize as an empty object
  loading = false;
  submitted = false;
  memberLoginStatus = false;
  loginUserName: string | null = null;  // Initialize as null

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    try {
      // Retrieve the current user from localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        // Add checks to ensure nested properties exist
        if (this.currentUser.responseData && this.currentUser.responseData.userDetail) {
          this.loginUserName = this.currentUser.responseData.userDetail.name;
        } else {
          console.warn('User detail is missing in currentUser');
          this.loginUserName = 'Guest';  // Default value
        }
      } else {
        console.warn('No user found in localStorage');
        this.loginUserName = 'Guest';  // Default value
      }
    } catch (error) {
      console.error('Error parsing currentUser from localStorage', error);
      this.loginUserName = 'Guest';  // Default value
    }
  }

  logout() {
    this.submitted = true;
    this.loading = true;
    const logout = this.authenticationService.logout();
    if (logout) {
      this.memberLoginStatus = false;
      this.toastr.success('Logged out successfully', 'Success');
      this.router.navigate(['/login']);
    } else {
      this.toastr.error('Issue with logout!', 'Failed');
    }
  }
}
