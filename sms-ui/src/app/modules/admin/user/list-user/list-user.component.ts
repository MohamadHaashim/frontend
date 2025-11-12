import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../core/service/admin/admin.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  users:any;
  deleteId: any;
  userData: any = [];
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  p: string | number | undefined;
  imgUrls=environment.baseUrl;
  constructor(
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.adminList(this.currentPage);
  }
  navigateToCreate() {
    this.router.navigate(['/admin/user/create']);
  }

  private adminList(curentPage: any): void {    
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 10,
    };
    this.spinner.show();
    this.adminService
      .adminList(data)
      .pipe(takeUntil(this.ngUnsubscribe),finalize(() => this.spinner.hide()))
      .subscribe((data) => {
        this.userData = data.body.responseData.adminData;
        // this.toastr.success(data.body.message);
        this.totalItems = data.body.responseData.totalRecordCount;
        this.spinner.hide();
            },
      error => {
        console.error('Error fetching school list:', error);
      });
  }
  
   //Pagenation
   onPageChange(page: any): void {
    this.adminList(page);
    this.currentPage = page;
  }
  
  getImageUrl(school: any): string {
    if (school && school.imageData && school.imageData.path && school.imageData.altered_file_name) {
      return `${this.imgUrls}${school.imageData.path}${school.imageData.altered_file_name}`;
    } else {
      return `${this.imgUrls}${"uploads/School_images/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs_240830100835.jpg"}`; // Replace with the actual path to your default image
    }
  }

  //Delete Admin
  setDeleteId(deleteId: any) {
    this.deleteId = deleteId;
    $('#confirmDeleteModal').modal('show');
  }
  closeDeleteModal() {
    this.deleteId = '';
    console.log(this.deleteId);
    $('#confirmDeleteModal').modal('hide');
  }

  confirmDelete() {
    if (!this.deleteId) {
      this.toastr.error('No item selected for deletion!', 'Error');
      return;
    }

    const query = {
      adminId: this.deleteId
    };
console.log(query);

    this.adminService.adminDelete(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data)=> {
        if (data.body.code === '200') {
          this.toastr.success(data.body.message, 'Success');
          $('#confirmDeleteModal').modal('hide');
          this.router.navigate(['/admin/user/list']);
        } else {
          this.toastr.error('Unable to delete religion!', 'Failed');
        }
        this.deleteId = '';
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
