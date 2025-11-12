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
import { SetupService } from '../../../../../core/service/setup/setup.service';
import { MasterService } from '../../../../../core/service/master/master.service';
import { $ } from 'protractor';



@Component({
  selector: 'app-list-fee',
  templateUrl: './list-fee.component.html',
  styleUrls: ['./list-fee.component.css'],
})
export class ListFeeComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  addFeeForm: FormGroup;
  loading = false;
  submitted = false;
  // feeList:any;

  categoryList: any;
  feesData: any;
  totalItems: any;
  curentPage =  -1;
  spinner: any;
  data:any;
  itemsPerPage = 10;
  deleteId: any;
  feeSectionData: any;
  feeClassData: any;
  // MasterService: any;
 

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    // private setupService: SetupService,
    private masterService :MasterService

  ) {
    this.addFeeForm = this.formBuilder.group({
      teacherSection: ['', Validators.required],
      staffName: ['', Validators.required],
      classes: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.feesLists(this.curentPage)
  
 
  }
  openAddModal() {
    const modal: any = document.getElementById('addStaffModal');
    modal.style.display = 'block';
  }
  closeAddModal() {
    const modal: any = document.getElementById('addStaffModal');
    modal.style.display = 'none';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addFeeForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }


    

  // Fees List

  private feesLists(curentPage: any): void {
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 10,
    };
    // this.spinner.show();
    this.masterService
      .feesList(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);

        this.feesData = data.body.responseData.feeList;

        this.totalItems = data.body.responseData.responseCount;
        console.log(this.totalItems);
        // this.spinner.hide();
      });
  }





   //Pagenation
   onPageChange(page: any): void {
    this.feesLists(page);
    this.curentPage = page;
  }



  // Delete Method

  // setDeleteId(deleteId: any) {
  //   this.deleteId = deleteId;
  //   console.log(this.deleteId);
    
  //   $('#confirmDeleteModal')['modal']('show');
  // }

  // openDeleteModal() {
  //   $('#confirmDeleteModal')['modal']('show');
  // }
  // closeDeleteModal() {
  //   this.deleteId = '';
  //   $('#confirmDeleteModal')['modal']('hide');
  // }

  // confirmDelete() {
  //   const query = { id: this.deleteId };
  //   console.log(query);
    
  //   this.masterService
  //     .getFeesDelete(query)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(
  //       (data) => {
  //         console.log(data); // Debugging line
  //         if (data.body && data.body.code === '200') {
  //           this.feesLists(this.curentPage);
  //           this.toastr.success(data.body.message, 'Success');
  //           $('#confirmDeleteModal')['modal']('hide');
  //         } else {
  //           this.toastr.error('Unable to Delete Staff!', 'Failed');
  //         }
  //       },
  //       (error) => {
  //         console.error('Delete failed', error);
  //         this.toastr.error('Server Error: Unable to Delete Staff!', 'Failed');
  //       }
  //     );
  // }


  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
