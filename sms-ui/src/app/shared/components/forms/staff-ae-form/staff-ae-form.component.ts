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

@Component({
  selector: 'app-staff-ae-form',
  templateUrl: './staff-ae-form.component.html',
  styleUrls: ['./staff-ae-form.component.css'],
})
export class StaffAeFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  addStudentForm!: FormGroup;
  loading = false;
  submitted = false;

  categoryList: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.addStudentForm = this.formBuilder.group({
      msgSubject: ['', Validators.required],
      msgContent: ['', Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.addStudentForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  addStudentSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addStudentForm.invalid) {
      return;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
