import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { MasterService } from '../../../../core/service/master/master.service';
import { StudentService } from '../../../../core/service/student/student.service';

import moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-student-ae-form',
  templateUrl: './student-ae-form.component.html',
  styleUrls: ['./student-ae-form.component.css'],
})
export class StudentAeFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  progressLineWidth = 16.666667;
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  studentId: any;

  addStudentPrimaryForm!: FormGroup;
  addStudentPersonalForm!: FormGroup;
  addStudentContactForm!: FormGroup;
  addStudentEducationForm!: FormGroup;
  addStudentCourseForm!: FormGroup;
  addStudentOtherForm!: FormGroup;

  loading = false;
  priSubmitted = false;
  perSubmitted = false;
  conSubmitted = false;
  eduSubmitted = false;
  couSubmitted = false;
  othSubmitted = false;
  @Input() returnUrl!: any;
  returnGetURL: any;
  salutationForMale = [
    {
      salutation_name: 'Mr.',
    },
    {
      salutation_name: 'Late',
    },
  ];
  salutationForFemale = [
    {
      salutation_name: 'Mrs.',
    },
    {
      salutation_name: 'Late',
    },
  ];

  boardList = [
    {
      board_name: 'SSLC',
    },
    {
      board_name: 'THSLC',
    },
    {
      board_name: 'ICSE',
    },
    {
      board_name: 'CBSE',
    },
    {
      board_name: 'Others',
    },
  ];

  clubList = [
    {
      club_name: 'NCC',
    },
    {
      club_name: 'Scout Guides',
    },
  ];

  likeToApplyForList = [
    {
      option_name: 'NSS',
    },
    {
      option_name: 'SPC',
    },
    {
      option_name: 'Scout&Guides',
    },
  ];

  categoryList: any;
  casteList: any;
  religionList: any;
  bloodGroupList: any;
  motherTonqueList: any;
  hobbiesList: any;
  culturalTalentsList: any;
  howDoYouComeList: any;
  sportsList: any;
  stateList: any;
  districtList: any;
  talukList: any;
  panchayatList: any;
  wardList: any;
  admittedCategoryList: any;
  classesList: any;
  secondaryLanguageList: any;

  selectedHobbiesItems: any;
  selectedTalentsItems: any;
  selectedHowDoYouComeItems: any;
  selectedSportsItems: any;

  dropdownHobbiesSettings = {};
  dropdownTalentsSettings = {};
  dropdownHowDoYouComeSettings = {};
  dropdownSportsSettings = {};

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private masterService: MasterService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.addStudentPrimaryForm = this.formBuilder.group({
      class: ['', Validators.required],
      admissionNo: ['', Validators.required],
      dob: ['', Validators.required],
      name: ['', Validators.required],
    });
    this.addStudentPersonalForm = this.formBuilder.group({
      gender: ['', Validators.required],
      category: [''],
      caste: [''],
      religion: [''],
      economicCategory: [''],
      bloodGroup: [''],
      ambition: [''],
      motherTongue: ['', Validators.required],
      hobbies: [''],
      culturalTalents: [''],
      howDoYouCome: [''],
      sports: [''],
      strength: [''],
      weakness: [''],
      languagesKnown: [''],
      otherSkills: [''],
      differnetlyAbled: ['No'],
      residentState: ['', Validators.required],
      residentDistrict: ['', Validators.required],
      residentTaluk: ['', Validators.required],
      residentPanchayat: ['', Validators.required],
      residentWard: ['', Validators.required],
      residentOtherDetail: [''],
      fatherSalutation: ['', Validators.required],
      fatherName: ['', Validators.required],
      fatherOccupation: ['', Validators.required],
      fatherOtherDetails: [''],
      motherSalutation: ['', Validators.required],
      motherName: ['', Validators.required],
      motherOccupation: ['', Validators.required],
      motherOtherDetails: [''],
      aadharNo: [''],
    });
    this.addStudentContactForm = this.formBuilder.group({
      contactPermanentAddressLine1: ['', Validators.required],
      contactPermanentAddressLine2: ['', Validators.required],
      contactPermanentAddressPIN: ['', Validators.required],
      contactContactAddressLine1: [''],
      contactContactAddressLine2: [''],
      contactContactAddressPIN: [''],
      studentPhone1: [''],
      studentPhone2: [''],
      studentWhatsAppNo: [''],
      studentTelegramNo: [''],
      studentEmail: [''],
      fatherPhoneNo1: [''],
      fatherPhoneNo2: [''],
      fatherPhoneNoOffice: [''],
      fatherTelegramNo: [''],
      fatherEmail: [''],
      motherPhoneNo1: [''],
      motherPhoneNo2: [''],
      motherPhoneNoOffice: [''],
      motherTelegramNo: [''],
      motherEmail: [''],
      sibiling: [''],
    });
    this.addStudentEducationForm = this.formBuilder.group({
      previousSchoolName: ['', Validators.required],
      previousSchoolPlace: ['', Validators.required],
      previousSchoolBoard: ['', Validators.required],
      previousSchoolRegistrationNo: [''],
      previousSchoolMarkEnglish: [''],
      previousSchoolMarkMalayalam: [''],
      previousSchoolMarkHindi: [''],
      previousSchoolMarkPhysics: [''],
      previousSchoolMarkChemistry: [''],
      previousSchoolMarkMaths: [''],
      previousSchoolMarkBiology: [''],
      previousSchoolMarkHistroy: [''],
      previousSchoolMarkGeography: [''],
      previousSchoolMarkIT: [''],
      previousSchoolClubMember: [''],
      previousSchoolOtherDetails: [''],
    });
    this.addStudentCourseForm = this.formBuilder.group({
      courseAdmittedCategory: ['', Validators.required],
      courseClassNo: ['', Validators.required],
      courseSecondLanguage: ['', Validators.required],
      courseExamRegistrationNo: [''],
      courseRecommendedBy: [''],
      courseWGPA: [''],
      courseAVP: [''],
      courseOtherDetails: [''],
      courseCompleted: ['No', Validators.required],
      courseTCIssued: ['No', Validators.required],
    });
    this.addStudentOtherForm = this.formBuilder.group({
      otherDetailApplyFor: ['', Validators.required],
      otherDetailFirstOption: [''],
      otherDetailSecondOption: [''],
      otherDetailThirdOption: [''],
    });

    this.getDropDownList();
    this.dropdownHobbiesSettings = {
      singleSelection: false,
      text: 'Select Hobbies',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      labelKey: 'hobby_name',
      badgeShowLimit: 2,
    };
    this.dropdownTalentsSettings = {
      singleSelection: false,
      text: 'Select Talents',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      labelKey: 'talent_name',
      badgeShowLimit: 2,
    };
    this.dropdownHowDoYouComeSettings = {
      singleSelection: false,
      text: 'Select How Do you Come',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      labelKey: 'conveyance_name',
      badgeShowLimit: 2,
    };
    this.dropdownSportsSettings = {
      singleSelection: false,
      text: 'Select Sports',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
      labelKey: 'sports_name',
      badgeShowLimit: 2,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  get prif() {
    return this.addStudentPrimaryForm.controls;
  }
  get perf() {
    return this.addStudentPersonalForm.controls;
  }
  get conf() {
    return this.addStudentContactForm.controls;
  }
  get eduf() {
    return this.addStudentEducationForm.controls;
  }
  get couf() {
    return this.addStudentCourseForm.controls;
  }
  get othf() {
    return this.addStudentOtherForm.controls;
  }

  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  private getDropDownList(): void {
    this.masterService
      .getCategoryList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.categoryList = data.body.responseData.categoryList;
      });
    this.masterService
      .getReligionList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.religionList = data.body.responseData.religionList;
      });
    this.masterService
      .getBloodGroupList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.bloodGroupList = data.body.responseData.bloodGroupList;
      });
    this.masterService
      .getMotherTongueList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.motherTonqueList = data.body.responseData.languageList;
      });
    this.masterService
      .getHobbiesList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.hobbiesList = data.body.responseData.hobbyList;
      });
    this.masterService
      .getCulturalTalentsList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.culturalTalentsList = data.body.responseData.talentList;
      });
    this.masterService
      .getHowDoYouComeList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.howDoYouComeList = data.body.responseData.conveyanceList;
      });
    this.masterService
      .getSportsList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.sportsList = data.body.responseData.sportsList;
      });
    this.masterService
      .getStateList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.stateList = data.body.responseData.stateList;
      });
    const queryParams = {};
    this.masterService
      .getDistrictList(queryParams)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.districtList = data.body.responseData.districtList;
      });
    this.masterService
      .getTalukList(queryParams)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.talukList = data.body.responseData.talukList;
      });
    this.masterService
      .getPanchayatList(queryParams)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.panchayatList = data.body.responseData.panchayatList;
      });
    this.masterService
      .getWardList(queryParams)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.wardList = data.body.responseData.wardList;
      });
    this.masterService
      .getAdmittedCategoryList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.admittedCategoryList = data.body.responseData.admittedCategoryList;
      });
    this.masterService
      .getClassesList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.classesList = data.body.responseData.classList;
      });
    this.masterService
      .getSecondaryLanguageList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.secondaryLanguageList =
          data.body.responseData.secondaryLanguageList;
      });
  }

  addStudentPrimarySubmit() {
    this.priSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentPrimaryForm.invalid) {
      return;
    }
    const bodyQuery = {
      id: this.studentId,
      class: this.prif['class'].value,
      admissionNo: this.prif['admissionNo'].value,
      dob: moment(this.prif['dob'].value).format('DD-MM-YYYY'),
      name: this.prif['name'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentPrimaryDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.studentId = data.body.responseData.insertedId;
            this.toastr.success('Student Added successfully', 'Success');
            this.clickNextWizard(1);
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.priSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.priSubmitted = false;
        }
      );
  }
  addStudentPersonalSubmit() {
    this.perSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentPersonalForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      gender: this.perf['gender'].value,
      category: this.perf['category'].value,
      caste: this.perf['caste'].value,
      religion: this.perf['religion'].value,
      economicCategory: this.perf['economicCategory'].value,
      bloodGroup: this.perf['bloodGroup'].value,
      ambition: this.perf['ambition'].value,
      motherTongue: this.perf['motherTongue'].value,
      hobbies: this.perf['hobbies'].value,
      culturalTalents: this.perf['culturalTalents'].value,
      howDoYouCome: this.perf['howDoYouCome'].value,
      sports: this.perf['sports'].value,
      strength: this.perf['strength'].value,
      weakness: this.perf['weakness'].value,
      languagesKnown: this.perf['languagesKnown'].value,
      otherSkills: this.perf['otherSkills'].value,
      differnetlyAbled: this.perf['differnetlyAbled'].value,
      residentState: this.perf['residentState'].value,
      residentDistrict: this.perf['residentDistrict'].value,
      residentTaluk: this.perf['residentTaluk'].value,
      residentPanchayat: this.perf['residentPanchayat'].value,
      residentWard: this.perf['residentWard'].value,
      residentOtherDetail: this.perf['residentOtherDetail'].value,
      fatherSalutation: this.perf['fatherSalutation'].value,
      fatherName: this.perf['fatherName'].value,
      fatherOccupation: this.perf['fatherOccupation'].value,
      fatherOtherDetails: this.perf['fatherOtherDetails'].value,
      motherSalutation: this.perf['motherSalutation'].value,
      motherName: this.perf['motherName'].value,
      motherOccupation: this.perf['motherOccupation'].value,
      motherOtherDetails: this.perf['motherOtherDetails'].value,
      aadharNo: this.perf['aadharNo'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentPersonalDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student profile detail updated successfully',
              'Success'
            );
            this.clickNextWizard(2);
          } else {
            this.toastr.error(
              'Have issue on student profile update, contact admin!',
              'Failed'
            );
          }
          this.perSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.perSubmitted = false;
        }
      );
  }
  addStudentContactSubmit() {
    this.conSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentContactForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      contactPermanentAddressLine1:
        this.conf['contactPermanentAddressLine1'].value,
      contactPermanentAddressLine2:
        this.conf['contactPermanentAddressLine2'].value,
      contactPermanentAddressPIN: this.conf['contactPermanentAddressPIN'].value,
      contactContactAddressLine1: this.conf['contactContactAddressLine1'].value,
      contactContactAddressLine2: this.conf['contactContactAddressLine2'].value,
      contactContactAddressPIN: this.conf['contactContactAddressPIN'].value,
      studentPhone1: this.conf['studentPhone1'].value,
      studentPhone2: this.conf['studentPhone2'].value,
      studentWhatsAppNo: this.conf['studentWhatsAppNo'].value,
      studentTelegramNo: this.conf['studentTelegramNo'].value,
      studentEmail: this.conf['studentEmail'].value,
      fatherPhoneNo1: this.conf['fatherPhoneNo1'].value,
      fatherPhoneNo2: this.conf['fatherPhoneNo2'].value,
      fatherPhoneNoOffice: this.conf['fatherPhoneNoOffice'].value,
      fatherTelegramNo: this.conf['fatherTelegramNo'].value,
      fatherEmail: this.conf['fatherEmail'].value,
      motherPhoneNo1: this.conf['motherPhoneNo1'].value,
      motherPhoneNo2: this.conf['motherPhoneNo2'].value,
      motherPhoneNoOffice: this.conf['motherPhoneNoOffice'].value,
      motherTelegramNo: this.conf['motherTelegramNo'].value,
      motherEmail: this.conf['motherEmail'].value,
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
            this.clickNextWizard(3);
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
  addStudentEducationSubmit() {
    this.eduSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentEducationForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      previousSchoolName: this.eduf['previousSchoolName'].value,
      previousSchoolPlace: this.eduf['previousSchoolPlace'].value,
      previousSchoolBoard: this.eduf['previousSchoolBoard'].value,
      previousSchoolRegistrationNo:
        this.eduf['previousSchoolRegistrationNo'].value,
      previousSchoolMarkEnglish: this.eduf['previousSchoolMarkEnglish'].value,
      previousSchoolMarkMalayalam:
        this.eduf['previousSchoolMarkMalayalam'].value,
      previousSchoolMarkHindi: this.eduf['previousSchoolMarkHindi'].value,
      previousSchoolMarkPhysics: this.eduf['previousSchoolMarkPhysics'].value,
      previousSchoolMarkChemistry:
        this.eduf['previousSchoolMarkChemistry'].value,
      previousSchoolMarkMaths: this.eduf['previousSchoolMarkMaths'].value,
      previousSchoolMarkBiology: this.eduf['previousSchoolMarkBiology'].value,
      previousSchoolMarkHistroy: this.eduf['previousSchoolMarkHistroy'].value,
      previousSchoolMarkGeography:
        this.eduf['previousSchoolMarkGeography'].value,
      previousSchoolMarkIT: this.eduf['previousSchoolMarkIT'].value,
      previousSchoolClubMember: this.eduf['previousSchoolClubMember'].value,
      previousSchoolOtherDetails: this.eduf['previousSchoolOtherDetails'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentEducationDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Education Details added successfully',
              'Success'
            );
            this.clickNextWizard(4);
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.eduSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.eduSubmitted = false;
        }
      );
  }
  addStudentCourseSubmit() {
    this.couSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentCourseForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      courseAdmittedCategory: this.couf['courseAdmittedCategory'].value,
      courseClassNo: this.couf['courseClassNo'].value,
      courseSecondLanguage: this.couf['courseSecondLanguage'].value,
      courseExamRegistrationNo: this.couf['courseExamRegistrationNo'].value,
      courseWGPA: this.couf['courseWGPA'].value,
      courseAVP: this.couf['courseAVP'].value,
      courseRecommendedBy: this.couf['courseRecommendedBy'].value,
      courseOtherDetails: this.couf['courseOtherDetails'].value,
      courseCompleted: this.couf['courseCompleted'].value,
      courseTCIssued: this.couf['courseTCIssued'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentCourseDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Course Detail added successfully',
              'Success'
            );
            this.clickNextWizard(5);
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.couSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.couSubmitted = false;
        }
      );
  }
  addStudentOtherSubmit() {
    this.othSubmitted = true;
    // stop here if form is invalid
    if (this.addStudentOtherForm.invalid) {
      return;
    }
    const bodyQuery = {
      studentId: this.studentId,
      otherDetailApplyFor: this.othf['otherDetailApplyFor'].value,
      otherDetailFirstOption: this.othf['otherDetailFirstOption'].value,
      otherDetailSecondOption: this.othf['otherDetailSecondOption'].value,
      otherDetailThirdOption: this.othf['otherDetailThirdOption'].value,
    };
    this.loading = true;
    this.studentService
      .addStudentOtherDetails(bodyQuery)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.body.code === '200') {
            this.toastr.success(
              'Student Other Details added successfully',
              'Success'
            );
            this.router.navigate(['/admin/student/list']);
          } else {
            this.toastr.error(
              'Have issue on student add, contact admin!',
              'Failed'
            );
          }
          this.othSubmitted = false;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error.error.message, 'Failed');
          this.loading = false;
          this.othSubmitted = false;
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  clickMenuWizard(curWizard: any) {
    if (curWizard < 2 || this.studentId) {
      this.removeActive();
      const tabMenu = '.tab-menu-' + curWizard;
      const tabCont = '.tab-cont-' + curWizard;
      $('.f1-step' + tabMenu).addClass('active');
      $('.f1 .fieldset' + tabCont).addClass('active');
      const newLeftProgressPos = this.progressLineWidth * (curWizard - 1);
      $('.f1-progress-line').attr(
        'style',
        'left: ' + newLeftProgressPos + '%;'
      );
    }
  }
  clickNextWizard(curWizard: any) {
    this.removeActive();
    const tabMenu = '.tab-menu-' + (curWizard + 1);
    const tabCont = '.tab-cont-' + (curWizard + 1);
    $('.f1-step' + tabMenu).addClass('active');
    $('.f1 .fieldset' + tabCont).addClass('active');
    const newLeftProgressPos = this.progressLineWidth * curWizard;
    $('.f1-progress-line').attr('style', 'left: ' + newLeftProgressPos + '%;');
  }
  clickPrevWizard(curWizard: any) {
    this.removeActive();
    const tabMenu = '.tab-menu-' + (curWizard - 1);
    const tabCont = '.tab-cont-' + (curWizard - 1);
    $('.f1-step' + tabMenu).addClass('active');
    $('.f1 .fieldset' + tabCont).addClass('active');
    const newLeftProgressPos = this.progressLineWidth * (curWizard - 2);
    $('.f1-progress-line').attr('style', 'left: ' + newLeftProgressPos + '%;');
  }

  private removeActive() {
    $('.f1-step').removeClass('active');
    $('.f1 .fieldset').removeClass('active');
  }
}
