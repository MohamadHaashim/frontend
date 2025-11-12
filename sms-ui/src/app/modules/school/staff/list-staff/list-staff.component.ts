import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../../../core/service/staff/staff.service';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.css'],
})
export class ListStaffComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  // staffList: any = [];
  totalItems = 0;
  deleteId: any;
  curentPage = 1;
  itemsPerPage = 10;
  staffData: any;
  isActive: boolean = true;
  imgUrls=environment.baseUrl;rolesData: any;
  constructor(
    private staffService: StaffService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.staffList(this.curentPage);
    this.rolesDropdown()
  }

  // Button on/off
  toggleStatus() {
    this.isActive = !this.isActive;
  }

  setActive(status: boolean) {
    this.isActive = status;
  }

  openAddModal() {
    const modal: any = document.getElementById('addStaffModal');
    modal.style.display = 'block';
  }
  closeAddModal() {
    const modal: any = document.getElementById('addStaffModal');
    modal.style.display = 'none';
  }


  private staffList(curentPage: any): void {
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 100,
    };
    this.staffService
      .staffList(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);

        this.staffData = data.body.responseData.staffData;

        this.totalItems = data.body.responseData.responseCount;
        console.log(this.totalItems);
      });
  }

 // Roles Dropdown Api

 private rolesDropdown(): void {
   
  this.staffService
    .assignRolesDropdown()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data) => {
      console.log(data);

      this.rolesData = data.body.responseData.roleList;
      console.log(this.rolesData,"dddddd");

      this.totalItems = data.body.responseData.responseCount;
      console.log(this.totalItems);
    });
}

   //Pagenation
   onPageChange(page: any): void {
    this.staffList(page);
    this.curentPage = page;
  }

  getImageUrl(staffData: any): string {
    if (staffData && staffData.imageData && staffData.imageData.path && staffData.imageData.altered_file_name) {
      return `${this.imgUrls}${staffData.imageData.path}${staffData.imageData.altered_file_name}`;
    } else {
      return "../../../../../assets/images/noimages.jpg"
        }
  }

  // Delete Method

  setDeleteId(deleteId: any) {
    this.deleteId = deleteId;
    console.log(this.deleteId);
    
    $('#confirmDeleteModal').modal('show');
  }

  openDeleteModal() {
    $('#confirmDeleteModal').modal('show');
  }
  closeDeleteModal() {
    this.deleteId = '';
    $('#confirmDeleteModal').modal('hide');
  }

  confirmDelete() {
    const query = { id: this.deleteId };
    console.log(query);
    
    this.staffService
      .deleteStaffDetails(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          console.log(data); // Debugging line
          if (data.body && data.body.code === '200') {
            this.staffList(this.curentPage);
            this.toastr.success(data.body.message, 'Success');
            $('#confirmDeleteModal').modal('hide');
          } else {
            this.toastr.error('Unable to Delete Staff!', 'Failed');
          }
        },
        (error) => {
          console.error('Delete failed', error);
          this.toastr.error('Server Error: Unable to Delete Staff!', 'Failed');
        }
      );
  }
  
}
