import { Component, Input, OnInit,ElementRef, ViewChild } from '@angular/core';
import { SchoolService } from '../../../../core/service/school/school.service';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { filter, startWith, takeUntil } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-school-view',
  standalone: true,
  templateUrl: './school-view.component.html',
  styleUrls: ['./school-view.component.css']
})
export class SchoolViewComponent implements OnInit {
  @Input() requiredFileType: string | undefined;
  @Input() studentId!: number;
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('fileUpload1') fileUpload1!: ElementRef<HTMLInputElement>;
  private ngUnsubscribe = new Subject();
  uploadProgress: any;
  profileId: any;
  loading = false;
  imgUrls=environment.baseUrl;
  selectedFiles?: FileList;
  selectedFiles1?: FileList;
  fileInfos?: Observable<any>;
  currentFile?: File;
  currentFile1?: File;
  uploadService: any;
  progress= 0;
  message= "";
  fileName = '';
  deleteId: any;
  imgId:number|null=null;
  // Define properties to hold data
  schoolName: string = '';
  schoolEmail: string = '';
  schoolPhone: string = '';
  schoolAddress: string = '';
  schoolImage: string = '';
  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  userAddress: string = '';
  userImage: string = '';
  imgDeleteId:string='';
  schoolImageId:string='';
  userImageId:string='';
  userId: any;

  // userId:string='';
  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[4];

    if (id) {
      this.profileId = parseInt(id);
      this.getSchoolDetails(this.profileId);
    }
    
  }
  navigateBack(){
    this.router.navigate(['/admin/school/list']);
  }
  private getSchoolDetails(id: number) {
    const query = { schoolId: id };
    this.schoolService.schoolGet(query).subscribe(
      (response) => {
        this.loading = false;
        if (response.body.responseData) {
          const data = response.body.responseData;
  
          if (data.imageData) {
            this.schoolImageId = data.imageData.img_id; 
            this.schoolImage = `${this.imgUrls}${data.imageData.path}${data.imageData.altered_file_name}`;
          } else {
           
            this.schoolImage = `${this.imgUrls}${"uploads/School_images/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs_240830100835.jpg"}`;
          }

          this.schoolName = data.school_name;
          this.schoolEmail = data.email;
          this.schoolPhone = data.phone;
          this.schoolAddress = data.address;

          if (data.userData && data.userData.length > 0) {
            const userData = data.userData[0];
            if(userData){
              this.userId=userData.user_id;
              console.log(this.userId);
            }
            if (userData.imageData) {
              this.userImageId = userData.imageData.img_id; 
              this.userImage = `${this.imgUrls}${userData.imageData.path}${userData.imageData.altered_file_name}`;
            } else {
              
              this.userImage = `${this.imgUrls}${"uploads/School_images/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs_240830100835.jpg"}`;
            }

            this.userName = `${userData.first_name} ${userData.last_name || ''}`;
            this.userEmail = userData.email;
            this.userPhone = userData.phone;
            this.userAddress = userData.address;
          }
        }
      },
      (error) => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  //<------FileUpdate_School-------->
selectFile(event: any): void {
  this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.fileName = this.selectedFiles[0].name;
    }
  }
upload(): void {
  this.progress = 0;
  if (this.selectedFiles) {
    const file: File | null = this.selectedFiles.item(0);
    if (file) {
      this.fileName = file.name;
      this.currentFile = file;
      this.schoolService.fileUpdateSchool(this.currentFile, this.profileId).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.toastr.success(event.body.message);
            this.imgId = event.body.responseData.img_id;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
          } else {
            this.toastr.error('Could not upload the file!');
          }
          this.currentFile = undefined;
        },
      });
    }
    this.selectedFiles = undefined;
  }
}


//<---------FileUpdateAdmin------->

selectFile1(event: any): void {
  this.selectedFiles1 = event.target.files;
    if (this.selectedFiles1 && this.selectedFiles1.length > 0) {
      this.fileName = this.selectedFiles1[0].name;
    }
  }
upload1(): void {
  this.progress = 0;
  if (this.selectedFiles1) {
    const file: File | null = this.selectedFiles1.item(0);
    if (file) {
      this.fileName = file.name;
      this.currentFile1 = file;
      if (!this.userId) {
        console.log(this.userId);
        this.toastr.error('User ID is not set.');
        return;
      }
      this.schoolService.fileUpdateAdmin(this.currentFile1, this.userId).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.toastr.success(event.body.message);
            this.imgId = event.body.responseData.img_id;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
          } else {
            this.toastr.error('Could not upload the file!');
          }
          this.currentFile1 = undefined;
        },
      });
    }
    this.selectedFiles1 = undefined;
  }
}

//<-----SchoolImageDelete----->
setDeleteId(deleteId: any) {
    this.deleteId = deleteId;
    console.log(deleteId,'del');
    $('#deletePhotoModal').modal('show');
  }
fileDeleteSchool() {
  const query = {
    schoolId: this.deleteId,
  };
  this.schoolService
    .fileDeleteSchool(query)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data) => {
      if (data.body.code === '200') {
        this.toastr.success(data.body.message, 'Success');
        this.router.navigate(['/admin/school/view/',this.profileId])
        $('#confirmDeleteModal').modal('hide');
      } else {
        this.toastr.error('Unable to Delete Student!', 'Failed');
      }
    });
}

//<-----AdminImageDelete----->
setDeleteId1(deleteId: any) {
  this.deleteId = deleteId;
  console.log(deleteId,'del');
  $('#deletePhotoModal1').modal('show');
}
fileDeleteAdmin() {
const query = {
  userId: this.deleteId,
};
this.schoolService
  .fileDeleteAdmin(query)
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe((data) => {
    if (data.body.code === '200') {
      this.toastr.success(data.body.message, 'Success');
      // this.router.navigate(['/admin/school/view/',this.profileId])
      $('#confirmDeleteModal').modal('hide');
    } else {
      this.toastr.error('Unable to Delete Student!', 'Failed');
    }
  });
}


  //School-Modal
  openChangePhotoModal() {
    $('#changePhotoModal').modal('show');
  }

  closeChangePhotoModal() {
    $('#changePhotoModal').modal('hide');
  }
  //Admin-Modal
  openChangePhotoModal1() {
    $('#changePhotoModal1').modal('show');
  }

  closeChangePhotoModal1() {
    $('#changePhotoModal1').modal('hide');
  }
  //DeleteSchoolImg
  openDeleteModal() {
    $('#deletePhotoModal').modal('show');
  }
  closeDeleteModal() {
    $('#deletePhotoModal').modal('hide');
  }
  //DeleteAdminImg
  openDeleteModal1() {
    $('#deletePhotoModal1').modal('show');
  }
  closeDeleteModal1() {
    $('#deletePhotoModal1').modal('hide');
  }
}
