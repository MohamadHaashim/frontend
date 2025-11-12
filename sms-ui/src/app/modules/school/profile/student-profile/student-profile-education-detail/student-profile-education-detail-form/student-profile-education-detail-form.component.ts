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
  selector: 'app-student-profile-education-detail-form',
  templateUrl: './student-profile-education-detail-form.component.html',
  styleUrls: ['./student-profile-education-detail-form.component.css'],
})
export class StudentProfileEducationDetailFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() studentId!: number;
  @Input() studentDetails!: any;

  addStudentEducationForm!: FormGroup;
  eduSubmitted = false;
  loading = false;

  boardList = [
    {
      board_name: 'SSLC',
    },
    {
      board_name: 'THSLC',
    },
    {
      board_name: 'ICSE',
    },
    {
      board_name: 'CBSE',
    },
    {
      board_name: 'Others',
    },
  ];
  clubList = [
    {
      club_name: 'NCC',
    },
    {
      club_name: 'Scout Guides',
    },
  ];

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.addStudentEducationForm = this.formBuilder.group({
      previousSchoolName: [this.studentDetails.name, Validators.required],
      previousSchoolPlace: [this.studentDetails.place, Validators.required],
      previousSchoolBoard: [this.studentDetails.board, Validators.required],
      previousSchoolRegistrationNo: [this.studentDetails.register_no],
      previousSchoolMarkEnglish: [this.studentDetails.mark_english],
      previousSchoolMarkMalayalam: [this.studentDetails.mark_malayalam],
      previousSchoolMarkHindi: [this.studentDetails.mark_hindi],
      previousSchoolMarkPhysics: [this.studentDetails.mark_physics],
      previousSchoolMarkChemistry: [this.studentDetails.mark_chemistry],
      previousSchoolMarkMaths: [this.studentDetails.mark_mathematics],
      previousSchoolMarkBiology: [this.studentDetails.mark_biology],
      previousSchoolMarkHistroy: [this.studentDetails.mark_histroy],
      previousSchoolMarkGeography: [this.studentDetails.mark_geography],
      previousSchoolMarkIT: [this.studentDetails.mark_it],
      previousSchoolClubMember: [this.studentDetails.club_member],
      previousSchoolOtherDetails: [this.studentDetails.other_details],
    });
  }
  get eduf() {
    return this.addStudentEducationForm.controls;
  }

  addStudentEducationSubmit() {
    this.eduSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentEducationForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      eduId: this.studentDetails.id,
      previousSchoolName: this.eduf['previousSchoolName'].value,
      previousSchoolPlace: this.eduf['previousSchoolPlace'].value,
      previousSchoolBoard: this.eduf['previousSchoolBoard'].value,
      previousSchoolRegistrationNo:
        this.eduf['previousSchoolRegistrationNo'].value,
      previousSchoolMarkEnglish: this.eduf['previousSchoolMarkEnglish'].value,
      previousSchoolMarkMalayalam:
        this.eduf['previousSchoolMarkMalayalam'].value,
      previousSchoolMarkHindi: this.eduf['previousSchoolMarkHindi'].value,
      previousSchoolMarkPhysics: this.eduf['previousSchoolMarkPhysics'].value,
      previousSchoolMarkChemistry:
        this.eduf['previousSchoolMarkChemistry'].value,
      previousSchoolMarkMaths: this.eduf['previousSchoolMarkMaths'].value,
      previousSchoolMarkBiology: this.eduf['previousSchoolMarkBiology'].value,
      previousSchoolMarkHistroy: this.eduf['previousSchoolMarkHistroy'].value,
      previousSchoolMarkGeography:
        this.eduf['previousSchoolMarkGeography'].value,
      previousSchoolMarkIT: this.eduf['previousSchoolMarkIT'].value,
      previousSchoolClubMember: this.eduf['previousSchoolClubMember'].value,
      previousSchoolOtherDetails: this.eduf['previousSchoolOtherDetails'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentEducationDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Education Details added successfully',
              'Success'
            );
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.eduSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.eduSubmitted = false;
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
