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
import moment from 'moment';

@Component({
  selector: 'app-student-primary-info-form',
  templateUrl: './student-primary-info-form.component.html',
  styleUrls: ['./student-primary-info-form.component.css'],
})
export class StudentPrimaryInfoFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() studentId!: number;
  @Input() studentDetails!: any;
  @Input() admittedCategoryList: any;
  selectedClass: any;
  classesList: any;
  secondaryLanguageList: any;

  addStudentPrimaryForm!: FormGroup;
  addStudentCourseForm!: FormGroup;
  loading = false;
  priSubmitted = false;
  couSubmitted = false;

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.masterService
      .getClassesList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.classesList = data.body.responseData.classList;
      });
    this.masterService
      .getAdmittedCategoryList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.admittedCategoryList = data.body.responseData.admittedCategoryList;
      });
    this.masterService
      .getSecondaryLanguageList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.secondaryLanguageList =
          data.body.responseData.secondaryLanguageList;
      });
    this.addStudentPrimaryForm = this.formBuilder.group({
      class: [this.studentDetails.class_id, Validators.required],
      admissionNo: [this.studentDetails.admission_no, Validators.required],
      dob: [this.studentDetails.dob, Validators.required],
      name: [this.studentDetails.name, Validators.required],
    });
    this.addStudentCourseForm = this.formBuilder.group({
      courseAdmittedCategory: [
        this.studentDetails.admitted_category_id,
        Validators.required,
      ],
      courseClassNo: [this.studentDetails.class_no, Validators.required],
      courseSecondLanguage: [
        this.studentDetails.second_language_id,
        Validators.required,
      ],
      courseExamRegistrationNo: [this.studentDetails.exam_registration_no],
      courseRecommendedBy: [this.studentDetails.recommended_by],
      courseOtherDetails: [this.studentDetails.other_details],
      courseCompleted: [
        this.studentDetails.course_completed,
        Validators.required,
      ],
      courseTCIssued: [this.studentDetails.tc_issued, Validators.required],
      courseWGPA: [this.studentDetails.wgpa],
      courseAVP: [this.studentDetails.avp],
    });
  }
  get prif() {
    return this.addStudentPrimaryForm.controls;
  }
  get couf() {
    return this.addStudentCourseForm.controls;
  }

  addStudentPrimarySubmit() {
    this.priSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentPrimaryForm.invalid) {
      return;
    }
    const bodyQuery = {
      id: this.studentId,
      class: this.prif['class'].value,
      admissionNo: this.prif['admissionNo'].value,
      dob: moment(this.prif['dob'].value).format('DD-MM-YYYY'),
      name: this.prif['name'].value,
    };
    this.loading = true;

    this.studentService
      .addStudentPrimaryDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(data.body.message, 'Success');
          } else {
            this.toastr.error(
              'Have issue on student add/update, contact admin!',
              'Failed'
            );
          }
          this.priSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.priSubmitted = false;
        }
      );
  }

  addStudentCourseSubmit() {
    this.couSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentCourseForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      courseAdmittedCategory: this.couf['courseAdmittedCategory'].value,
      courseClassNo: this.couf['courseClassNo'].value,
      courseSecondLanguage: this.couf['courseSecondLanguage'].value,
      courseExamRegistrationNo: this.couf['courseExamRegistrationNo'].value,
      courseRecommendedBy: this.couf['courseRecommendedBy'].value,
      courseOtherDetails: this.couf['courseOtherDetails'].value,
      courseCompleted: this.couf['courseCompleted'].value,
      courseTCIssued: this.couf['courseTCIssued'].value,
      courseWGPA: this.couf['courseWGPA'].value,
      courseAVP: this.couf['courseAVP'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentCourseDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(data.body.message, 'Success');
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.priSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.priSubmitted = false;
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
