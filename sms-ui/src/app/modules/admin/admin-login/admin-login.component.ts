import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/authentication';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      // loginType: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

 
  loginSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log("erferf");
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(
        "Super Admin",
        this.f['username'].value,
        this.f['password'].value
      )
      
      .pipe(first())
      .subscribe(
        
        (data) => {
          if (data.responseData.token) {

            localStorage.setItem("token",data.responseData.token)
            this.returnUrl = data.responseData.userDetail.redirectUrl;
            this.router.navigate([this.returnUrl]);
            this.toastr.success('Logged in successfully', 'Success');
          } else {
            this.toastr.error('Unautherised login attempt!', 'Failed');
          }
        },
        (error) => {
          this.toastr.error('Unautherised login attempt!', 'Failed');
          this.loading = false;
        }
      );
  }


}




// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';
// import { AuthenticationService } from '../../../core/authentication';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-admin-login',
//   templateUrl: './admin-login.component.html',
//   styleUrls: ['./admin-login.component.css']
// })
// export class AdminLoginComponent {
//   loginForm!: FormGroup;
//   loading = false;
//   submitted = false;
//   returnUrl!: string;

//   constructor(
//     private formBuilder: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private authenticationService: AuthenticationService,
//     private toastr: ToastrService
//   ) {}

//   ngOnInit(): void {
//     this.loginForm = this.formBuilder.group({
//       // loginType: ['', Validators.required],
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//     });
//   }

//   // convenience getter for easy access to form fields
//   get f() {
//     return this.loginForm.controls;
//   }

//   loginSubmit() {
//     this.submitted = true;

//     // stop here if form is invalid
//     if (this.loginForm.invalid) {
//       return;
//     }

//     this.loading = true;
//     this.authenticationService
//       .login(
//         "Super Admin",
//         this.f['username'].value,
//         this.f['password'].value
//       )
//       .pipe(first())
//       .subscribe(
//         (data) => {
//           if (data.responseData.token) {
//             this.returnUrl = data.responseData.userDetail.redirectUrl;
//             this.router.navigate([this.returnUrl]);
//             this.toastr.success('Logged in successfully', 'Success');
//           } else {
//             this.toastr.error('Unautherised login attempt!', 'Failed');
//           }
//         },
//         (error) => {
//           this.toastr.error('Unautherised login attempt!', 'Failed');
//           this.loading = false;
//         }
//       );
//   }
// }

