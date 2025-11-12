import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { MasterService } from '../../../../core/service/master/master.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-caste-categories',
  templateUrl: './caste-categories.component.html',
  styleUrl: './caste-categories.component.css'
})
export class CasteCategoriesComponent implements OnInit  {
  private ngUnsubscribe = new Subject();
  currentPath: string = '/admin/settings/caste-categories/list';
  deleteId: any;
  studentList: any = [];
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  p: string | number | undefined;
  constructor(private router: Router,
    private masterService:MasterService,
    private toastr: ToastrService
  ) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/settings/caste-categories/create']);
  }

  ngOnInit(): void {
    this.casteList(this.currentPage);
  }
  
  private casteList(curentPage: any): void {    
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 10,
    };
    this.masterService
      .casteList(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.studentList = data.body.responseData.studentList;
        this.toastr.success(data.body.message);
        this.totalItems = data.body.responseData.totalRecord;
            },
      error => {
        console.error('Error fetching school list:', error);
      });
  }
  //Pagenation
  onPageChange(page: any): void {
    this.casteList(page);
    this.currentPage = page;
  }
  setDeleteId(deleteId: any) {
    this.deleteId = deleteId;
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
    const query = {
      casteId: this.deleteId,
    };
    this.masterService
      .casteDelete(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.body.code === '200') {
          this.toastr.success(data.body.message, 'Success');
          window.location.reload();
          this.router.navigate(['/admin/settings/caste-categories/list']);
          $('#confirmDeleteModal').modal('hide');
        } else {
          this.toastr.error('Unable to Delete Student!', 'Failed');
        }
      });
  }
}
