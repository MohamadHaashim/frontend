import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { StudentService } from '../../../../../core/service/student/student.service';
declare var $: any;

@Component({
  selector: 'app-student-primary-info',
  templateUrl: './student-primary-info.component.html',
  styleUrls: ['./student-primary-info.component.css'],
})
export class StudentPrimaryInfoComponent implements OnInit {
  @Input() loginUserRole: any;
  @Input() studentId!: number;
  @Input() requiredFileType: string | undefined;
  fileName = '';
  uploadProgress: number | undefined;
  uploadSub!: Subscription;
  editMode = false;
  profileId: any;
  private ngUnsubscribe = new Subject();
  studentDetails: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  photoStudentId: any;
  http: any;

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.profileId = this.studentId;
    console.log('Profile Id: ', this.profileId);
    this.getStudentDetail();
  }

  private getStudentDetail(): void {
    const query = {
      studentId: this.profileId,
    };
    this.studentService
      .getStudentSinglePrimaryData(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.studentDetails = data.body.responseData;
      });
  }

  enableViewMode() {
    this.editMode = false;
    this.getStudentDetail();
  }
  enableEditMode() {
    this.editMode = true;
  }

  openChangePhotoModal() {
    $('#changePhotoModal').modal('show');
  }
  closeChangePhotoModal() {
    this.photoStudentId = '';
    $('#changePhotoModal').modal('hide');
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);

      const upload$ = this.http
        .post('/api/thumbnail-upload', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload$.subscribe(
        (event: { type: any; loaded: number; total: number }) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              100 * (event.loaded / event.total)
            );
          }
        }
      );
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    // this.uploadSub = "";
  }
  submitPhotoChange() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
