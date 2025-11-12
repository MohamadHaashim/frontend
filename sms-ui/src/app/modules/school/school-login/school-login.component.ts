import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/authentication';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-school-login',
  templateUrl: './school-login.component.html',
  styleUrls: ['./school-login.component.css']
})

export class SchoolLoginComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;

  loginTypes = [
    {
      type_name: 'School Admin',
    },
    {
      type_name: 'Staff',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      loginType: ['', Validators.required],
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
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(
        this.f['loginType'].value,
        this.f['username'].value,
        this.f['password'].value
      )
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.responseData.token) {
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
