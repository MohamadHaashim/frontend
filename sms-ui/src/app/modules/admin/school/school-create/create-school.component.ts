import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../../core/authentication';
import { ToastrService } from 'ngx-toastr';
import { first, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { SchoolService } from '../../../../core/service/school/school.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-school',
  templateUrl: './create-school.component.html',
  // styleUrls: ['./dashboard.component.css']
})
export class CreateSchoolComponent implements OnInit {
  currentPath: string = '/admin/school/create';
  schoolCreateForm!: FormGroup;
  submitted = false;
  selectedFile: File | null = null;
  loading= false;
  pdfFileFormatPdfFileSize: Boolean = false;
  File: any = '';
  uploadFileForm!: FormGroup;
  fileUploadScreen: boolean = true;
  selectedFiles?: FileList;
  selectedFiles1?: FileList;
  fileInfos?: Observable<any>;
  currentFile?: File;
  currentFile1?: File;
  uploadService: any;
  progress= 0;
  message= "";
  imgId:number|null=null;
  userimgId:number|null=null;
  isEditMode = false;
  profileId: any;
  passwordFieldType: string = 'password'; 
  confirmPasswordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder, 
    private router: Router,     
    private authenticationService: AuthenticationService,
    public schoolService:SchoolService,
    private modalService: NgbModal,
    private toastr: ToastrService
    
  ) {}

  ngOnInit(): void {
    const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[4];

    if (id) {
      this.isEditMode = true;
      this.profileId = parseInt(id);
      this.getSchoolList(this.profileId);
    } else {
      this.isEditMode = false;
    }
    this.schoolCreateForm = this.fb.group({
      school_name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      img_id: [''],
      user_name: [''],
      user_email: [''],
      password: [''],
      confirm_password: [''],
      user_address: [''],
      user_phone: [''],
      user_img_id: [''],
    });
  }
  get f() { 
    return this.schoolCreateForm.controls; 
  }
  showUserDetails = false;

  private getSchoolList(id: number) {
      const query = {
          schoolId: id,
      };
  
      this.schoolService.schoolGet(query).subscribe(
          (response) => {
              this.loading = false;
              if (response.body.responseData) {
                  const schoolData = response.body.responseData;
                  
                  // Check if userData is available
                  const userData = schoolData.userData ? schoolData.userData[0] : null;
  
                  // Determine if user details should be shown
                  this.showUserDetails = !!userData;
  
                  this.schoolCreateForm.patchValue({
                      school_name: schoolData.school_name,
                      email: schoolData.email,
                      phone: schoolData.phone,
                      address: schoolData.address,
                      img_id: schoolData.imageData?.img_id || '',
                      user_name: userData ? userData.first_name || '' : '',
                      user_email: userData ? userData.email || '' : '',
                      password: userData ? userData.password || '' : '',
                      confirm_password: userData ? userData.confirm_password || '' : '',
                      user_phone: userData ? userData.phone || '' : '',
                      user_address: userData ? userData.address || '' : '',
                      user_img_id: userData ? userData.imageData?.img_id || '' : ''
                  });
  
                  this.imgId = schoolData.imageData?.img_id || null;
                  this.userimgId = userData?.imageData?.img_id || null;
              }
          },
          (error) => {
              this.loading = false;
              console.error(error);
          }
      );
  }
  
  
  
  //Visible button
  toggleVisibility(field: 'password' | 'confirm_password') {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirm_password') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
  //schoolCreate
  schoolFormSubmit() {
    this.submitted = true;
    
    if (this.schoolCreateForm.invalid) {      
        return;
    }

    const schoolData = {
        id: this.profileId,
        school_name: this.f['school_name'].value,
        email: this.f['email'].value,
        phone: this.f['phone'].value,
        address: this.f['address'].value,
        img_id: this.imgId   
    };

    // Only include user data if it's available
    const bodyQuery = {
        school_data: schoolData,
        ...(this.f['user_name']?.value && {
            user_data: {
                user_name: this.f['user_name'].value,
                user_email: this.f['user_email'].value,
                password: this.f['password'].value,
                confirm_password: this.f['confirm_password'].value,
                user_phone: this.f['user_phone'].value,
                user_address: this.f['user_address'].value,
                user_img_id: this.userimgId
            }
        })
    };

    this.loading = true;

    const request$ = this.isEditMode
        ? this.schoolService.schoolUpdate(bodyQuery)
        : this.schoolService.schoolCreate(bodyQuery);

    request$.subscribe(
        (response) => {
            this.loading = false;
            if (response.status === 200) {
                this.router.navigate(['/admin/school/list']);
                this.toastr.success(response.body.message);
            } else {
                this.toastr.error(response.body.message);
            }
        },
        (error) => {
            this.loading = false;
            const errorMessage = error?.error?.message || 'An unknown error occurred';
            this.toastr.error(errorMessage, 'Failed');
            console.error(errorMessage);
        }
    );
}


//schoolFileUpload
selectFile(event: any): void {
  this.selectedFiles = event.target.files;
  this.upload();
}
upload(): void {
  this.progress = 0;
  if (this.selectedFiles) {
    const file: File | null = this.selectedFiles.item(0);
    if (file) {
      this.currentFile = file;
      this.schoolService.fileUploadSchool(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.toastr.success(event.body.message);
            this.imgId=event.body.responseData.img_id;
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

//adminFileUpload
selectFile1(event: any): void {
  this.selectedFiles1 = event.target.files;
  this.upload1();
}

upload1(): void {
  this.progress = 0;
  if (this.selectedFiles1) {
    const file: File | null = this.selectedFiles1.item(0);
    if (file) {
      this.currentFile1 = file;
      this.schoolService.fileUploadAdmin(this.currentFile1).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.toastr.success(event.body.message);
            this.userimgId=event.body.responseData.img_id;
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
}
