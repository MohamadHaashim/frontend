import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { CommentsService } from '../../core/service/comments/comments.service';

import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  studentId: any;
  commentForm!: FormGroup;
  loading = false;
  comSubmitted = false;
  commentList: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.studentId = this.activatedRoute.snapshot.params['studentId'];
    this.getCommentList();
    this.commentForm = this.formBuilder.group({
      commentArea: ['', Validators.required],
    });
  }
  get commentF() {
    return this.commentForm.controls;
  }

  private getCommentList(): void {
    const query = {
      type: 'student',
      refId: this.studentId,
    };
    this.commentsService
      .getCommentList(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.commentList = data.body.responseData.commentsList;
      });
  }

  addComment() {
    this.comSubmitted = true;
    // stop here if form is invalid
    if (this.commentForm.invalid) {
      return;
    }
    const bodyQuery = {
      type: 'student',
      refId: this.studentId,
      comments: this.commentF['commentArea'].value,
    };
    this.loading = true;
    this.commentsService
      .addComments(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Comment/Feedback Added successfully',
              'Success'
            );
          } else {
            this.toastr.error(
              'Have issue on student comment add, contact admin!',
              'Failed'
            );
          }
          this.comSubmitted = false;
          this.loading = false;
          this.getCommentList();
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.comSubmitted = false;
        }
      );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
