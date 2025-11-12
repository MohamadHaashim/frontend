import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../../../../core/service/school/school.service';
import { AdminService } from '../../../../core/service/admin/admin.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router} from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
  // styleUrls: ['./dashboard.component.css']
})
export class CreateUserComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  userCreateForm!: FormGroup;
  submitted = false;
  schoolList: any;
  selectedFiles?: FileList;
  currentFile?: File;
  File: any = '';
  progress= 0;
  isEditMode = false;
  profileId: any;
  userimgId:number|null=null;
  loading= false;
  passwordFieldType: string = 'password'; // Initially hide password
  confirmPasswordFieldType: string = 'password'; // Initially hide confirm password
  imagePreviewUrl: any;
  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private adminService:AdminService,
    private toastr: ToastrService,
    private router: Router, 
  ) { } 
  

  ngOnInit(): void {
    this.schoolService
      .schoolNameList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.schoolList = data.body.responseData.schoolList;
      });
      const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[4];

    if (id) {
      this.isEditMode = true;
      this.profileId = parseInt(id);
      this.getAdminList(this.profileId);
    } else {
      this.isEditMode = false;
    }

    this.userCreateForm = this.fb.group({
      user_name: ['', Validators.required],
      user_email: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      user_phone: ['', Validators.required],
      school: [''],
      user_address: [''],
      user_img_id: [''],
    });
    
  }
  get f() {
    return this.userCreateForm.controls;
  }
 private getAdminList(id: number) {
  const query = {
    adminId: id,
  }; 
  this.adminService.adminGet(query).subscribe(
    (response) => {
      this.loading = false;
      if (response.body.responseData) {
        const { adminData, schoolData, imageData } = response.body.responseData;

        this.userCreateForm.patchValue({
          //user_name: adminData.first_name + ' ' + adminData.middle_name + ' ' + adminData.last_name, // or adjust according to form control names
          user_name: adminData.first_name,
          user_email: adminData.email,
          user_phone: adminData.phone,
          user_address: adminData.address,
          password: adminData.password,
          confirm_password: adminData.confirm_password,
          school: schoolData ? schoolData.school_id : null, 
        });
        if (imageData) {
          this.userimgId  = imageData ? imageData.img_id :null;
        }
      }
    },
    (error) => {
      this.loading = false;
      console.error(error);
    }
  );
}

  toggleVisibility(field: 'password' | 'confirm_password') {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirm_password') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  
  schoolFormSubmit() {
    this.submitted = true;

    if (this.userCreateForm.invalid) {
      return;
    }
    const formValues={
          user_name: this.f['user_name'].value,
          user_email: this.f['user_email'].value,
          password: this.f['password'].value,
          confirm_password: this.f['confirm_password'].value,
          user_phone: this.f['user_phone'].value,
          user_address: this.f['user_address'].value,
          school_id:this.f['school'].value,
          user_img_id: this.userimgId
    }
    const bodyQuery= this.isEditMode 
    ?{
      user_data: {
          user_id:this.profileId,
          ...formValues
        }
      }
      : formValues;
      this.loading=true;
      if (this.isEditMode) {
        this.adminService.adminUpdate(bodyQuery).subscribe(
          (response) => {
            this.loading = false;
            if (response.status === 200) {
              this.router.navigate(['/admin/user/list']);
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
      else{
        this.loading = true;
        this.adminService.adminCreate(bodyQuery)
            .subscribe(
                (response) => {
                    this.loading = false;
                    if (response.status === 200) {
                      
                        this.router.navigate(['/admin/user/list']);
                        this.toastr.success(response.body.message);
                    } else {
                        this.toastr.error('Failed to create category', 'Error');
                    }
                },
                (error) => {
                    this.loading = false;
                    this.toastr.error(error.error.message, 'Failed');
                }
              );
  }
}

  
  
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload1();
  }
  
  upload1(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) { 
        this.currentFile = file;
        this.schoolService.fileUploadAdmin(this.currentFile).subscribe({
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
            this.currentFile = undefined;
          },
        });
      }
      this.selectedFiles = undefined;
    }
  }
}

