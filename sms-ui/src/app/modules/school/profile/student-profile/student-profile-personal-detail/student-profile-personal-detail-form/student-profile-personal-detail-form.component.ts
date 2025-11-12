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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-student-profile-personal-detail-form',
  templateUrl: './student-profile-personal-detail-form.component.html',
  styleUrls: ['./student-profile-personal-detail-form.component.css'],
})
export class StudentProfilePersonalDetailFormComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() studentId!: number;
  @Input() studentDetails!: any;

  addStudentPersonalForm!: FormGroup;
  perSubmitted = false;
  loading = false;

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

  selectedHobbiesItems: any;
  selectedTalentsItems: any;
  selectedHowDoYouComeItems: any;
  selectedSportsItems: any;

  dropdownHobbiesSettings = {};
  dropdownTalentsSettings = {};
  dropdownHowDoYouComeSettings = {};
  dropdownSportsSettings = {};

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

  fatherId = '';
  fatherSalutation = '';
  fatherName = '';
  fatherOccupation = '';
  fatherOtherdetails = '';
  motherId = '';
  motherSalutation = '';
  motherName = '';
  motherOccupation = '';
  motherOtherdetails = '';

  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    protected html_sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getDropDownList();
    if (this.studentDetails) {
      if (this.studentDetails.relations.length > 0) {
        for (let i = 0; i < this.studentDetails.relations.length; i++) {
          if (this.studentDetails.relations[i].type === 'Father') {
            this.fatherSalutation = this.studentDetails.relations[i].salutation;
            this.fatherName = this.studentDetails.relations[i].name;
            this.fatherOccupation = this.studentDetails.relations[i].occupation;
            this.fatherOtherdetails =
              this.studentDetails.relations[i].other_details;
            this.fatherId = this.studentDetails.relations[i].id;
          }
          if (this.studentDetails.relations[i].type === 'Mother') {
            this.motherSalutation = this.studentDetails.relations[i].salutation;
            this.motherName = this.studentDetails.relations[i].name;
            this.motherOccupation = this.studentDetails.relations[i].occupation;
            this.motherOtherdetails =
              this.studentDetails.relations[i].other_details;
            this.motherId = this.studentDetails.relations[i].id;
          }
        }
      }
      this.selectedHobbiesItems = this.studentDetails.hobbies;
      this.selectedTalentsItems = this.studentDetails.talents;
      this.selectedHowDoYouComeItems = this.studentDetails.conveyance;
      this.selectedSportsItems = this.studentDetails.sports;
    }
    this.addStudentPersonalForm = this.formBuilder.group({
      gender: [this.studentDetails.gender, Validators.required],
      category: [this.studentDetails.category_id],
      caste: [this.studentDetails.caste],
      religion: [this.studentDetails.religion_id],
      economicCategory: [this.studentDetails.economic_category],
      bloodGroup: [this.studentDetails.blood_group],
      ambition: [this.studentDetails.ambition],
      motherTongue: [this.studentDetails.mother_tongue, Validators.required],
      hobbies: [''],
      culturalTalents: [''],
      howDoYouCome: [''],
      sports: [''],
      strength: [this.studentDetails.strength],
      weakness: [this.studentDetails.weakness],
      languagesKnown: [this.studentDetails.languages_known],
      otherSkills: [this.studentDetails.other_skills],
      differnetlyAbled: [this.studentDetails.differnetly_abled],
      residentState: [
        this.studentDetails.resident.state_id,
        Validators.required,
      ],
      residentDistrict: [
        this.studentDetails.resident.district_id,
        Validators.required,
      ],
      residentTaluk: [
        this.studentDetails.resident.taluk_id,
        Validators.required,
      ],
      residentPanchayat: [
        this.studentDetails.resident.panchayat_id,
        Validators.required,
      ],
      residentWard: [this.studentDetails.resident.ward_id, Validators.required],
      residentOtherDetail: [this.studentDetails.resident.other_details],
      fatherSalutation: [this.fatherSalutation, Validators.required],
      fatherName: [this.fatherName, Validators.required],
      fatherOccupation: [this.fatherOccupation, Validators.required],
      fatherOtherDetails: [this.fatherOtherdetails],
      motherSalutation: [this.motherSalutation, Validators.required],
      motherName: [this.motherName, Validators.required],
      motherOccupation: [this.motherOccupation, Validators.required],
      motherOtherDetails: [this.motherOtherdetails],
      aadharNo: [this.studentDetails.aadhar_no],
    });
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
  get perf() {
    return this.addStudentPersonalForm.controls;
  }

  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
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
      residentId: this.studentDetails.resident.id,
      residentState: this.perf['residentState'].value,
      residentDistrict: this.perf['residentDistrict'].value,
      residentTaluk: this.perf['residentTaluk'].value,
      residentPanchayat: this.perf['residentPanchayat'].value,
      residentWard: this.perf['residentWard'].value,
      residentOtherDetail: this.perf['residentOtherDetail'].value,
      fatherId: this.fatherId,
      fatherSalutation: this.perf['fatherSalutation'].value,
      fatherName: this.perf['fatherName'].value,
      fatherOccupation: this.perf['fatherOccupation'].value,
      fatherOtherDetails: this.perf['fatherOtherDetails'].value,
      motherId: this.motherId,
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

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
