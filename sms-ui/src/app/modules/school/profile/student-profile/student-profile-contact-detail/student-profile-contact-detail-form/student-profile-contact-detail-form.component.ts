import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MasterService } from '../../../../../../core/service/master/master.service';
import { StudentService } from '../../../../../../core/service/student/student.service';
import * as moment from 'moment';

@Component({
  selector: 'app-student-profile-contact-detail-form',
  templateUrl: './student-profile-contact-detail-form.component.html',
  styleUrls: ['./student-profile-contact-detail-form.component.css'],
})
export class StudentProfileContactDetailFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() studentId!: number;
  @Input() studentDetails!: any;

  addStudentContactForm!: FormGroup;
  conSubmitted = false;
  loading = false;

  perAddressId = '';
  perAddressLine1 = '';
  perAddressLine2 = '';
  perAddressPin = '';
  conAddressId = '';
  conAddressLine1 = '';
  conAddressLine2 = '';
  conAddressPin = '';

  studentConId = '';
  studentConPhone1 = '';
  studentConPhone2 = '';
  studentConWhatsAppNo = '';
  studentConTelegramNo = '';
  studentConEmail = '';
  fatherConId = '';
  fatherConPhoneNo1 = '';
  fatherConPhoneNo2 = '';
  fatherConPhoneNoOffice = '';
  fatherConTelegramNo = '';
  fatherConEmail = '';
  motherConId = '';
  motherConPhoneNo1 = '';
  motherConPhoneNo2 = '';
  motherConPhoneNoOffice = '';
  motherConTelegramNo = '';
  motherConEmail = '';

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    if (this.studentDetails) {
      if (this.studentDetails.address.length > 0) {
        for (let i = 0; i < this.studentDetails.address.length; i++) {
          if (this.studentDetails.address[i].type === 'permanent') {
            this.perAddressLine1 = this.studentDetails.address[i].address_line1;
            this.perAddressLine2 = this.studentDetails.address[i].address_line2;
            this.perAddressPin = this.studentDetails.address[i].pin;
            this.perAddressId = this.studentDetails.address[i].id;
          }
          if (this.studentDetails.address[i].type === 'contact') {
            this.conAddressLine1 = this.studentDetails.address[i].address_line1;
            this.conAddressLine2 = this.studentDetails.address[i].address_line2;
            this.conAddressPin = this.studentDetails.address[i].pin;
            this.conAddressId = this.studentDetails.address[i].id;
          }
        }
      }
      if (this.studentDetails.contactDetails) {
        for (let j = 0; j < this.studentDetails.contactDetails.length; j++) {
          if (this.studentDetails.contactDetails[j].type === 'Student') {
            this.studentConId = this.studentDetails.contactDetails[j].id;
            this.studentConPhone1 =
              this.studentDetails.contactDetails[j].phone1;
            this.studentConPhone2 =
              this.studentDetails.contactDetails[j].phone2;
            this.studentConWhatsAppNo =
              this.studentDetails.contactDetails[j].whatsapp;
            this.studentConTelegramNo =
              this.studentDetails.contactDetails[j].telegram;
            this.studentConEmail = this.studentDetails.contactDetails[j].email;
          }
          if (this.studentDetails.contactDetails[j].type === 'Father') {
            this.fatherConId = this.studentDetails.contactDetails[j].id;
            this.fatherConPhoneNo1 =
              this.studentDetails.contactDetails[j].phone1;
            this.fatherConPhoneNo2 =
              this.studentDetails.contactDetails[j].phone2;
            this.fatherConPhoneNoOffice =
              this.studentDetails.contactDetails[j].phone_office;
            this.fatherConTelegramNo =
              this.studentDetails.contactDetails[j].telegram;
            this.fatherConEmail = this.studentDetails.contactDetails[j].email;
          }
          if (this.studentDetails.contactDetails[j].type === 'Mother') {
            this.motherConId = this.studentDetails.contactDetails[j].id;
            this.motherConPhoneNo1 =
              this.studentDetails.contactDetails[j].phone1;
            this.motherConPhoneNo2 =
              this.studentDetails.contactDetails[j].phone2;
            this.motherConPhoneNoOffice =
              this.studentDetails.contactDetails[j].phone_office;
            this.motherConTelegramNo =
              this.studentDetails.contactDetails[j].telegram;
            this.motherConEmail = this.studentDetails.contactDetails[j].email;
          }
        }
      }
    }

    this.addStudentContactForm = this.formBuilder.group({
      contactPermanentAddressLine1: [this.perAddressLine1, Validators.required],
      contactPermanentAddressLine2: [this.perAddressLine2, Validators.required],
      contactPermanentAddressPIN: [this.perAddressPin, Validators.required],
      contactContactAddressLine1: [this.conAddressLine1],
      contactContactAddressLine2: [this.conAddressLine2],
      contactContactAddressPIN: [this.conAddressPin],
      studentPhone1: [this.studentConPhone1],
      studentPhone2: [this.studentConPhone2],
      studentWhatsAppNo: [this.studentConWhatsAppNo],
      studentTelegramNo: [this.studentConTelegramNo],
      studentEmail: [this.studentConEmail],
      fatherPhoneNo1: [this.fatherConPhoneNo1],
      fatherPhoneNo2: [this.fatherConPhoneNo2],
      fatherPhoneNoOffice: [this.fatherConPhoneNoOffice],
      fatherTelegramNo: [this.fatherConTelegramNo],
      fatherEmail: [this.fatherConEmail],
      motherPhoneNo1: [this.motherConPhoneNo1],
      motherPhoneNo2: [this.motherConPhoneNo2],
      motherPhoneNoOffice: [this.motherConPhoneNoOffice],
      motherTelegramNo: [this.motherConTelegramNo],
      motherEmail: [this.motherConEmail],
      sibiling: [this.studentDetails.sibiling],
    });
  }
  get conf() {
    return this.addStudentContactForm.controls;
  }

  addStudentContactSubmit() {
    this.conSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentContactForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      perAddressId: this.perAddressId,
      contactPermanentAddressLine1:
        this.conf['contactPermanentAddressLine1'].value,
      contactPermanentAddressLine2:
        this.conf['contactPermanentAddressLine2'].value,
      contactPermanentAddressPIN: this.conf['contactPermanentAddressPIN'].value,
      conAddressId: this.conAddressId,
      contactContactAddressLine1: this.conf['contactContactAddressLine1'].value,
      contactContactAddressLine2: this.conf['contactContactAddressLine2'].value,
      contactContactAddressPIN: this.conf['contactContactAddressPIN'].value,
      studentConId: this.studentConId,
      studentPhone1: this.conf['studentPhone1'].value,
      studentPhone2: this.conf['studentPhone2'].value,
      studentWhatsAppNo: this.conf['studentWhatsAppNo'].value,
      studentTelegramNo: this.conf['studentTelegramNo'].value,
      studentEmail: this.conf['studentEmail'].value,
      fatherConId: this.fatherConId,
      fatherPhoneNo1: this.conf['fatherPhoneNo1'].value,
      fatherPhoneNo2: this.conf['fatherPhoneNo2'].value,
      fatherPhoneNoOffice: this.conf['fatherPhoneNoOffice'].value,
      fatherTelegramNo: this.conf['fatherTelegramNo'].value,
      fatherEmail: this.conf['fatherEmail'].value,
      motherConId: this.motherConId,
      motherPhoneNo1: this.conf['motherPhoneNo1'].value,
      motherPhoneNo2: this.conf['motherPhoneNo2'].value,
      motherPhoneNoOffice: this.conf['motherPhoneNoOffice'].value,
      motherTelegramNo: this.conf['motherTelegramNo'].value,
      motherEmail: this.conf['motherEmail'].value,
      siblings: this.conf['sibiling'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentContactDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Contact Details added successfully',
              'Success'
            );
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.conSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.conSubmitted = false;
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
