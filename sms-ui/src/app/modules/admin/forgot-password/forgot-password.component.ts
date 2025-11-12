import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/authentication';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      user_name: ['', Validators.required],
    });
  }

 // convenience getter for easy access to form fields
  get f() {
    return this.forgotForm.controls;
  }

  forgotPassword() {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .forgotPassword(
        this.f['user_name'].value,
      )
      .pipe(first())
      .subscribe(
        
        (data) => {
          if (data.responseData.message) {
            console.log(data.responseData.message);
            this.router.navigate(['/resetPassword']);
            this.toastr.success(data.responseData.message);
          }
        },
      );
  }







}
