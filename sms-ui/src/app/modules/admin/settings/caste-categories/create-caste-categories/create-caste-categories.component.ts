import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../../../../core/service/master/master.service';

@Component({
  selector: 'app-create-caste-categories',
  templateUrl: './create-caste-categories.component.html',
  styleUrls: ['./create-caste-categories.component.css']
})
export class CreateCasteCategoriesComponent implements OnInit {
  schoolCreateForm!: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;
  profileId?: number; // Changed to optional type

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private masterService: MasterService,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    const queryParams = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[5];

    if (id) {
      this.isEditMode = true;
      this.profileId = parseInt(id);
      this.getCasteList(this.profileId);
    }
    this.schoolCreateForm = this.fb.group({
      category_name: ['', Validators.required],
      category_desc: [''] 
    });
  }

  get f() {
    return this.schoolCreateForm.controls;
  }
//Get API
  private getCasteList(id: number): void {
    const query = {
      casteId: id,
    };
    this.masterService.casteGet(query).subscribe(
      response => {
        this.loading = false;
        if (response.body?.responseData) {
          this.schoolCreateForm.patchValue(response.body.responseData);
        }
      },
      error => {
        this.loading = false;
        console.error('Error fetching caste list:', error);
        this.toastr.error('Failed to fetch caste details', 'Error');
      }
    );
  }

  casteCreate(): void {
    this.submitted = true;
    if (this.schoolCreateForm.invalid) {
      return;
    }

    // Extract form values
    const formValues = {
      category_name: this.f['category_name'].value,
      category_desc: this.f['category_desc'].value
    };

    // Prepare request payload based on mode
    const bodyQuery = this.isEditMode
      ? {
          category_data: {
            id: this.profileId,
            ...formValues
          }
        }
      : formValues;

    this.loading = true;
    const apiCall = this.isEditMode
      ? this.masterService.casteUpdate(bodyQuery)
      : this.masterService.casteCreate(bodyQuery);

    apiCall.subscribe(
      response => {
        this.loading = false;
        if (response.status === 200) {
          const successMessage = this.isEditMode ? 'Category updated successfully' : 'Category created successfully';
          this.router.navigate(['/admin/settings/caste-categories/list']);
          this.toastr.success(successMessage);
        } else {
          this.toastr.error(response.body?.message || 'Operation failed', 'Error');
        }
      },
      error => {
        this.loading = false;
        const errorMessage = error?.error?.message || 'An unknown error occurred';
        this.toastr.error(errorMessage, 'Failed');
        console.error('API call error:', errorMessage);
      }
    );
}

}
