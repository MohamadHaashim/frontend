import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MasterService } from '../../../../core/service/master/master.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  addGeneralForm: FormGroup;
  loading = false;
  submitted = false;

  categoryList: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private masterService: MasterService
  ) {
    this.addGeneralForm = this.formBuilder.group({
      schoolName: ['', Validators.required],
      schollSlogan: ['', Validators.required],
      schoolAddress: ['', Validators.required],
      principalSignature: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  // convenience getter for easy access to form fields
  get f() {
    return this.addGeneralForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  addGeneralSubmit() {
    // stop here if form is invalid
    this.submitted = true;
    if (this.addGeneralForm.invalid) {
      return;
    }

    const bodyParams = {
      schoolName:this.f['schoolName'].value ,
      schoolSlogan:this.f['schollSlogan'].value ,
      schoolAddress:this.f['schoolAddress'].value ,
      principalSignature: this.f['principalSignature'].value

    }

    this.masterService
      .addGeneralDetail(bodyParams)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.status  === '200') {
            // this.staffId = data.body.responseData.insertedId;
            this.toastr.success(response.body.message);
          } else {
            this.toastr.error(response.body.message );
          }
          this.submitted = false;
          // this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          // this.loading = false;
          this.submitted = false;
        }
      );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
