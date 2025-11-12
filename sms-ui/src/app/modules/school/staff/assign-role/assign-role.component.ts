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
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.css'],
})
export class AssignRoleComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  assignRoleForm!: FormGroup;
  loading = false;
  submitted = false;
  categoryList: any;
  assignRole: any;
  totalItems: any;
  curentPage = 1;
  itemsPerPage = 10;
  // selectedRoles: any;
  selectedRoles: { [staffId: string]: number[] } = {};

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.assignRoleForm = this.formBuilder.group({
      // msgSubject: ['', Validators.required],
      // msgContent: ['', Validators.required],
    });

    this.assignRoleList(this.curentPage)

  }

 //Pagenation
 onPageChange(page: any): void {
  this.assignRoleList(page);
  this.curentPage = page;
}


  // convenience getter for easy access to form fields
  get f() {
    return this.assignRoleForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  addStudentSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.assignRoleForm.invalid) {
      return;
    }
  }

  // Assign Role

  private assignRoleList(curentPage: any): void {
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 10,
    };
    this.staffService
      .staffList(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);

        this.assignRole = data.body.responseData.staffData;

        this.totalItems = data.body.responseData.responseCount;
        console.log(this.totalItems);
      });
  }

  assignRoleSubmit(staffId: string) {
    this.submitted = true;
    
    // Ensure form validation logic if needed
    if (!this.selectedRoles[staffId] || this.selectedRoles[staffId].length === 0) {
      this.toastr.error('Please select at least one role', 'Failed');
      return;
    }
  
    const bodyParams = {
      id: staffId,
      role: this.selectedRoles[staffId]  // Send selected roles for the staff
    };
  
    this.staffService.assignRolesDetails(bodyParams)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success('Role assigned successfully', 'Success');
          } else {
            this.toastr.error('Failed to assign role, contact admin!', 'Failed');
          }
          this.submitted = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.submitted = false;
        }
      );
  }

  
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  // checkBoxHandle(e: any) {
  //   console.log(e);
  //   if (e.target.name == 'admin') {
  //     console.log("gh");
      
  //   } else {
  //   }
  // }

  checkBoxHandle(event: any, staffId: string) {
    const roleId = +event.target.value; // Get the role ID from the checkbox value
    const isChecked = event.target.checked;
  
    if (!this.selectedRoles[staffId]) {
      this.selectedRoles[staffId] = [];
    }
  
    if (isChecked) {
      // Add the role ID if checked
      this.selectedRoles[staffId].push(roleId);
    } else {
      // Remove the role ID if unchecked
      this.selectedRoles[staffId] = this.selectedRoles[staffId].filter(
        (id: number) => id !== roleId
      );
    }
  
    console.log(`Selected roles for staff ID ${staffId}:`, this.selectedRoles[staffId]);
  }


}
