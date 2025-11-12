import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../../../core/service/student/student.service';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css'],
})
export class ListStudentComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  studentList: any = [];
  deleteId: any;
  searchStudentForm: FormGroup;
  totalItems = 1;
  currentPage = 1;
  itemsPerPage = 20;

  p: string | number | undefined;
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    public sanitizer: DomSanitizer,
    private studentService: StudentService,
    private formBuilder: FormBuilder
  ) {
    this.searchStudentForm = this.formBuilder.group({
      searchByAdmissionNo: [''],
      searchByName: [''],
      searchByDOB: [''],
      searchByAadhar: [''],
      searchByClass: [''],
    });
  }

  ngOnInit(): void {
    // this.getStudentList(this.currentPage);
    this.searchForStudent(this.currentPage);
  }

  get prif() {
    return this.searchStudentForm.controls;
  }
  // selectedCount(chosenCount){
  //   this.perPage = chosenCount;
  // }

  private getStudentList(curentPage: any): void {
    const data = {
      pageIndex: curentPage - 1,
      dataLength: 20,
    };
    this.studentService
      .getStudentList(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);
        this.studentList = data.body.responseData.studentList;
        this.totalItems = data.body.responseData.totalRecord;
        console.log(this.studentList,'list');
      });
  }

  onPageChange(page: any): void {
    // Fetch data based on the new page
    this.getStudentList(page);
    this.currentPage = page;
    console.log('Page changed to: ', page);
  }

  searchForStudent(curentPage: any) {
    this.studentList = {};
    let searchDob = '';
    console.log(this.searchStudentForm);

    if (this.searchStudentForm.value.searchDob != '') {
      searchDob = moment(this.searchStudentForm.value.searchDob).format(
        'DD-MM-YYYY'
      );
    }
    const bodyQuery = {
      searchByAdmissionNo: this.searchStudentForm.value.searchByAdmissionNo,
      searchByClass: this.searchStudentForm.value.searchByClass,
      searchByName: this.searchStudentForm.value.searchByName,
      searchByDOB: this.searchStudentForm.value.searchDob,
      searchByAadhar: this.searchStudentForm.value.searchByAadhar,
      pageIndex: curentPage - 1,
      dataLength: 20,
    };
    this.studentService
      .searchForStudent(bodyQuery)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.body.code === '200') {
          this.studentList = data.body.responseData.studentList;
          this.totalItems = data.body.responseData.totalRecord;
          console.log(data.body.responseData.totalRecord);

          this.toastr.success(data.body.message, 'Success');
        } else {
          this.toastr.error(
            'Have issue on student add, contact admin!',
            'Failed'
          );
        }
      });
  }

  clearSearch() {
    this.searchStudentForm.reset();
    // this.prif['searchByClass'] = new FormControl('');
    // this.prif['searchByAdmissionNo'] = new FormControl('');
    // this.prif['searchByName'] = new FormControl('');
    // this.prif['searchByDOB'] = new FormControl('');
    // this.prif['searchByAadhar'] = new FormControl('');
    this.searchForStudent(this.currentPage);
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
      studentId: this.deleteId,
    };
    this.studentService
      .deleteStudent(query)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data.body.code === '200') {
          this.getStudentList(this.currentPage);
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
