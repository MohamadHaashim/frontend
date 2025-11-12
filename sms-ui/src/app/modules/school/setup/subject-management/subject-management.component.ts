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
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css'],
})
export class SubjectManagementComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  addSubjectForm: FormGroup;
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
    this.addSubjectForm = this.formBuilder.group({
      subject: ['', Validators.required],
      shortName: ['', Validators.required],
      class: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  // convenience getter for easy access to form fields
  get f() {
    return this.addSubjectForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  addSubjectSubmit() {
    // stop here if form is invalid
    this.submitted = true;
    if (this.addSubjectForm.invalid) {
      return;
    }

    this.masterService
      .addSubjectDetails(this.addSubjectForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            // this.staffId = data.body.responseData.insertedId;
            this.toastr.success(
              'Subject details added successfully',
              'Success'
            );
          } else {
            this.toastr.error(
              'Have issue on subject details add, contact admin!',
              'Failed'
            );
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
