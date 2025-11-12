import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/authentication';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  loading = false;
  submitted = false;
  token:any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[2];
    console.log(id);
    this.token=id;
    console.log(this.token,'token');
    // this.route.queryParams.subscribe(params => {
    //   this.token = params['token'];
    // })
    
    // if (id) {
    //   this.profileId = parseInt(id);
    //   this.getSchoolDetails(this.profileId);
    // }
    this.resetForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required], 
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }
  
  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.authenticationService
      .resetPassword(
        this.token,
        this.f['newPassword'].value,
        this.f['confirmPassword'].value
      )
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.responseData.message) {
            console.log(data.responseData.message);
            this.toastr.success(data.responseData.message);
          }
        },
        (error) => {
          console.error('Error resetting password', error);
          this.toastr.error('Failed to reset password');
        },
        () => {
          this.loading = false;
        }
      );
  }
  
}
