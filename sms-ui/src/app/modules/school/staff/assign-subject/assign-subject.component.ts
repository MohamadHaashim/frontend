import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { StaffService } from '../../../../core/service/staff/staff.service';

@Component({
  selector: 'app-assign-class',
  templateUrl: './assign-subject.component.html',
  styleUrls: ['./assign-subject.component.css'],
})
export class AssignSubjectComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  addSubjectForm: FormGroup;
  loading = false;
  submitted = false;

  categoryList: any;
  staffData: any;
  sectionData: any;
  subjectData: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private staffService: StaffService
  ) {
    this.addSubjectForm = this.formBuilder.group({
      staffID: ['', Validators.required],
      staffName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
   this.sectionList()
   this.subjectList()
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.addSubjectForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  // Subject Sections Dropdown Api

  private sectionList(): void {
    const data = {
      pageIndex: 0,
      dataLength: 10,
    };
    this.staffService
      .assignSubjectsDetails(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);

        this.subjectData = data.body.responseData.subjectList;

       
      });
  }

    // Subject  Dropdown Api

    private subjectList(): void {
      const data = {
        pageIndex: 0,
        dataLength: 10,
      };
      this.staffService
        .assignSectionsDetails(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          console.log(data);
  
          this.sectionData = data.body.responseData.sectionList;
  
         
        });
    }

  addSubjectSubmit() {
    // stop here if form is invalid
    this.submitted = true;
    if (this.addSubjectForm.invalid) {
      return;
    }
    const bodyParams = {
      "id": "224",
      "section": "Secondary",
      "subject": [
          2
      ]
    }

    this.staffService
      .assignSubjectDetails(this.addSubjectForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            // this.staffId = data.body.responseData.insertedId;
            this.toastr.success('Class assign successfully', 'Success');
          } else {
            this.toastr.error(
              'Have issue on class assign, contact admin!',
              'Failed'
            );
          }
          this.submitted = false;
          // this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          // this.loading = false;
          this.submitted = false;
        }
      );
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  // Subject Multiselect Method

  // Array to store selected subjects
selectedSubjects: number[] = [];

// Check if subject is already selected
isChecked(id: number): boolean {
  return this.selectedSubjects.includes(id);
}

// Handle checkbox change
onCheckboxChange(event: any) {
  const subjectId = event.target.value;

  if (event.target.checked) {
    // Add to selectedSubjects if checked
    this.selectedSubjects.push(subjectId);
  } else {
    // Remove from selectedSubjects if unchecked
    this.selectedSubjects = this.selectedSubjects.filter(id => id !== subjectId);
  }

  // Update the form control value with selected subjects
  this.addSubjectForm.get('subjectName')?.setValue(this.selectedSubjects);
}


}


//  // Toggle dropdown
//  toggleDropdown() {
//   this.dropdownOpen = !this.dropdownOpen;
// }

// // Check if subject is selected
// isChecked(id: number): boolean {
//   return this.selectedSubjects.includes(id.toString());
// }

// // Handle checkbox changes
// onCheckboxChange(event: any, subject: any) {
//   const isChecked = event.target.checked;
//   const subjectName = subject.subject_name;

//   if (isChecked) {
//     // Add the subject to selectedSubjects if checked
//     this.selectedSubjects.push(subjectName);
//   } else {
//     // Remove from selectedSubjects if unchecked
//     this.selectedSubjects = this.selectedSubjects.filter(
//       (name: any) => name !== subjectName
//     );
//   }

//   // Update form control value
//   this.addSubjectForm.controls['subjectName'].setValue(this.selectedSubjects);
// }