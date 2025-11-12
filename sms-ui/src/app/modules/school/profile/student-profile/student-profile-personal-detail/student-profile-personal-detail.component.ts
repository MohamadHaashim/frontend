import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { StudentService } from '../../../../../core/service/student/student.service';
@Component({
  selector: 'app-student-profile-personal-detail',
  templateUrl: './student-profile-personal-detail.component.html',
  styleUrls: ['./student-profile-personal-detail.component.css'],
})
export class StudentProfilePersonalDetailComponent implements OnInit {
  @Input() studentId!: number;
  editMode = false;
  profileId: any;
  private ngUnsubscribe = new Subject();
  studentDetails: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  constructor(
    private toastr: ToastrService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.profileId = this.studentId;
    this.getStudentDetail();
  }
  private getStudentDetail(): void {
    const query = {
      studentId: this.profileId,
    };
    this.studentService
      .getStudentProfileDetails(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.studentDetails = data.body.responseData;
      });
  }

  enableViewMode() {
    this.editMode = false;
  }
  enableEditMode() {
    this.editMode = true;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
