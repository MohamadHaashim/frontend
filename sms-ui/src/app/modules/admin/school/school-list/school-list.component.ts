import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { filter, finalize, startWith, takeUntil } from 'rxjs/operators';
import { Router,ActivatedRoute} from '@angular/router';
import {SchoolService } from '../../../../core/service/school/school.service';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiceConfig } from '../../../../core/service/service.url.config';
import { environment } from '../../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;
@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css'],
})
export class SchoolListComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentPath: string = '/admin/school/list';
  schoolData: any = [];
  totalItems = 1;
  currentPage = 1;
  itemsPerPage = 12;
  deleteId: any;
  p: string | number | undefined;
  imgUrls=environment.baseUrl;
  constructor(
    private router: Router, 
    private schoolService: SchoolService,
    protected html_sanitizer: DomSanitizer,
    public sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService 
  ) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/school/create']);
  }
  navigateToEdit(id: number) {
    this.router.navigate(['/admin/school/edit/',id]);
  }
  ngOnInit(): void {
    this.schoolList(this.currentPage);
  }
  private schoolList(curentPage: any): void {    
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 12,
    };
    this.spinner.show();
    this.schoolService
      .schoolList(data)
      .pipe(takeUntil(this.ngUnsubscribe),finalize(() => this.spinner.hide()))
      .subscribe((data) => {
        this.schoolData = data.body.responseData.schoolData;
        // this.toastr.success(data.body.message);
        this.totalItems = data.body.responseData.totalRecordCount;
        this.spinner.hide();
            },
      error => {
        console.error('Error fetching school list:', error);
        
      });
     
  }
  getImageUrl(school: any): string {
    if (school && school.imageData && school.imageData.path && school.imageData.altered_file_name) {
      return `${this.imgUrls}${school.imageData.path}${school.imageData.altered_file_name}`;
    } else {
      return `${this.imgUrls}${"uploads/School_images/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs_240830100835.jpg"}`; // Replace with the actual path to your default image
    }
  }
  
  //Pagenation
  onPageChange(page: any): void {
    this.schoolList(page);
    this.currentPage = page;
  }
  setDeleteId(deleteId: any) {
    this.deleteId = deleteId;
    console.log(deleteId,'del');
    $('#confirmDeleteModal').modal('show');
  }

  openDeleteModal() {
    $('#confirmDeleteModal').modal('show');
  }
  closeDeleteModal() {
    $('#confirmDeleteModal').modal('hide');
  }

  confirmDelete() {
    const query = {
      schoolId: this.deleteId,
    };
    this.schoolService
      .schoolDelete(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.body.code === '200') {
          this.schoolList(this.currentPage);
          this.toastr.success(data.body.message, 'Success');
          $('#confirmDeleteModal').modal('hide');
        } else {
          this.toastr.error('Unable to Delete Student!', 'Failed');
        }
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
