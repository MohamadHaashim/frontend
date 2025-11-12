import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MasterService } from '../../../../../core/service/master/master.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-religions',
  templateUrl: './create-religions.component.html',
  styleUrls: ['./create-religions.component.css']
})
export class CreateReligionsComponent implements OnInit {
  schoolCreateForm!: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;
  profileId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Get id in url
    const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[5];

    if (id) {
      this.isEditMode = true;
      this.profileId = parseInt(id);
      this.getReligionList(this.profileId);
    } else {
      this.isEditMode = false;
    }

    this.schoolCreateForm = this.fb.group({
      religion_name: ['', Validators.required],
      religion_desc: ['']
    });
  }

  get f() {
    return this.schoolCreateForm.controls;
  }
  //Get API
  private getReligionList(id: number) {
    const query = {
      religionId: id,
    };
    this.masterService.religionGet(query).subscribe(
      (response) => {
        this.loading = false;
        if (response.body.responseData) {
          this.schoolCreateForm.patchValue(response.body.responseData);
        }
      },
      (error) => {
        this.loading = false;
        console.error(error);
      }
    );
  }
  //Create and Update -API
  onSubmit() {
    this.submitted = true;
    if (this.schoolCreateForm.invalid) {
      return;
    }

    const formValues = {
      religion_name: this.f['religion_name'].value,
      religion_desc: this.f['religion_desc'].value
    };

    const requestPayload = this.isEditMode
      ? {
          religion_data: {
            id: this.profileId,
            ...formValues
          }
        }
      : formValues;

    this.loading = true;

    if (this.isEditMode) {
      this.masterService.religionUpdate(requestPayload).subscribe(
        (response) => {
          this.loading = false;
          if (response.status === 200) {
            this.router.navigate(['/admin/settings/religions/list']);
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
    } else {
      this.masterService.religionCreate(requestPayload).subscribe(
        (response) => {
          this.loading = false;
          if (response.status === 200) {
            this.router.navigate(['/admin/settings/religions/list']);
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
}

}
