import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MasterService } from '../../../../../../core/service/master/master.service';
import { StudentService } from '../../../../../../core/service/student/student.service';
import * as moment from 'moment';

@Component({
  selector: 'app-student-profile-other-detail-form',
  templateUrl: './student-profile-other-detail-form.component.html',
  styleUrls: ['./student-profile-other-detail-form.component.css'],
})
export class StudentProfileOtherDetailFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() studentId!: number;
  @Input() studentDetails!: any;

  addStudentOtherForm!: FormGroup;
  othSubmitted = false;
  loading = false;
  likeToApplyDefaultStatus = 'No';

  likeToApplyForList = [
    {
      option_name: 'NSS',
    },
    {
      option_name: 'SPC',
    },
    {
      option_name: 'Scout&Guides',
    },
  ];

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    if (this.studentDetails.like_to_apply) {
      this.likeToApplyDefaultStatus = this.studentDetails.like_to_apply;
    }
    this.addStudentOtherForm = this.formBuilder.group({
      otherDetailApplyFor: [this.likeToApplyDefaultStatus, Validators.required],
      otherDetailFirstOption: [this.studentDetails.option1],
      otherDetailSecondOption: [this.studentDetails.option2],
      otherDetailThirdOption: [this.studentDetails.option3],
    });
  }
  get othf() {
    return this.addStudentOtherForm.controls;
  }

  clickApplyStatus(status: any) {
    this.likeToApplyDefaultStatus = status;
  }

  addStudentOtherSubmit() {
    this.othSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentOtherForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      otherDetailId: this.studentDetails.id,
      otherDetailApplyFor: this.othf['otherDetailApplyFor'].value,
      otherDetailFirstOption: this.othf['otherDetailFirstOption'].value,
      otherDetailSecondOption: this.othf['otherDetailSecondOption'].value,
      otherDetailThirdOption: this.othf['otherDetailThirdOption'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentOtherDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Other Details added successfully',
              'Success'
            );
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.othSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.othSubmitted = false;
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
