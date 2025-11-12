import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { MasterService } from '../../../../core/service/master/master.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;
@Component({
  selector: 'app-religions',
  templateUrl: './religions.component.html',
  styleUrl: './religions.component.css'
})
export class ReligionsComponent implements OnInit  {
  private ngUnsubscribe = new Subject();
  currentPath: string = '/admin/settings/religions/list';
  deleteId: any;
  religionLists: any = [];
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  p: string | number | undefined;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private masterService:MasterService,
    private toastr: ToastrService,
    private spinner : NgxSpinnerService,
  ) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/settings/religions/create']);
  }

  ngOnInit(): void {
    this.religionList(this.currentPage);
  }
  private religionList(curentPage: any): void {    
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 10,
    };
    this.spinner.show();
    this.masterService
      .religionList(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.religionLists = data.body.responseData.religionList;
        // this.toastr.success(data.body.message);
        this.totalItems = data.body.responseData.totalRecord;
        this.spinner.hide();
            },
      error => {
        console.error('Error fetching school list:', error);
      });
  }
  //Pagenation
  onPageChange(page: any): void {
    this.religionList(page);
    this.currentPage = page;
  }
  setDeleteId(deleteId: any) {
    this.deleteId = deleteId;
    $('#confirmDeleteModal').modal('show');
  }

  openDeleteModal() {
    // $('#confirmDeleteModal').modal('show');
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
      religionId: this.deleteId
    };
console.log(query);

    this.masterService.religionDelete(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data)=> {
        if (data.body.code === '200') {
          this.toastr.success(data.body.message, 'Success');
          $('#confirmDeleteModal').modal('hide');
          this.router.navigate(['/admin/settings/religions/list']);
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
