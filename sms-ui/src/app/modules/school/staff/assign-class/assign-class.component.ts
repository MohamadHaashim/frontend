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
import { StaffService } from '../../../../core/service/staff/staff.service';

@Component({
  selector: 'app-assign-class',
  templateUrl: './assign-class.component.html',
  styleUrls: ['./assign-class.component.css'],
})
export class AssignClassComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  assignClassForm: FormGroup;
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
    private staffService: StaffService
  ) {
    this.assignClassForm = this.formBuilder.group({
      teacherSection: ['', Validators.required],
      staffName: ['', Validators.required],
      classes: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  // convenience getter for easy access to form fields
  get f() {
    return this.assignClassForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  assignClassSubmit() {
    // stop here if form is invalid
    this.submitted = true;
    if (this.assignClassForm.invalid) {
      return;
    }

    this.staffService
      .assignClassDetails(this.assignClassForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            // this.staffId = data.body.responseData.insertedId;
            this.toastr.success('Class assign successfully', 'Success');
          } else {
            this.toastr.error(
              'Have issue on class assign, contact admin!',
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
