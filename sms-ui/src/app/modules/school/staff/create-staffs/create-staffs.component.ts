import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter, first, takeUntil } from 'rxjs/operators';
import { StaffService } from '../../../../core/service/staff/staff.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { $ } from 'protractor';
import { ObservableInput } from 'rxjs';

@Component({
  selector: 'app-create-staffs',
  templateUrl: './create-staffs.component.html',
  styleUrls: ['./create-staffs.component.css'],
})
export class CreateStaffsComponent implements OnInit {
  @ViewChild('multiSelect') multiSelect: any;
  currentPath: Boolean = true;
  headName = 'Add';
  submitBtnName = 'Create';
  addStaffForm!: FormGroup;
  submitted = false;
  staffId: any;
  isEditMode = false;
  loading = false;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  userimgId: number | null = null;
  profileId: any;
  dataService: any;
  responce:any;
  deleteId: any;
  ngUnsubscribe!: ObservableInput<any>;
  passwordFieldType: string = 'password'; // Initially hide password
  confirmPasswordFieldType: string = 'password'; // Initially hide confirm password
  rolesData: any;
  totalItems: any;
  selectedRoles: any;

  data: { item_id: number; item_text: string; }[] = [];
  experiences: any;
  fields: any;
  roleData: any;
  contactForm!: FormGroup;
  submit: boolean = false;
  contactFormQuali: any;
  nationData: any;
  stateData: any;
  stateDataId: any;
  nationDataId: any;
  rolesId: any;
  qualificationArray: any[] = [];
  experiencesArray: any[] = [];
  degrees: any;
  gradePercentages: any;
  years: any;
  year: any;
  formattedQualifications: any;
  id: any;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private staffService: StaffService,
    private toastr: ToastrService,
    
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url == '/admin/staff/edit') {
          this.currentPath = false;
          this.headName = 'Edit';
          this.submitBtnName = 'Update';
        } else {
          this.currentPath = true;
          this.headName = 'Add';
          this.submitBtnName = 'Create';
        }
      });

    this.addStaffForm = this.fb.group({
      staff_id: [''],
      type: [''],
      designation: [''],
      date_of_appointment: [''],
      first_name: [''],
      last_name: [''],
      middle_name: [''],
      dob: ['', Validators.required],
      nationality: [''],
      state: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: [''],
      gender: [''],
      role: [''],
      confirm_password: ['', Validators.required],
      address: [''],
      img_id: [''],
      degree: [''],
      year: [''],
      grade: [''],
      school: [''],
      years: [''],
      qualifications: this.fb.array([])
    });
  }

  isDropdownOpen = false;
  selectedOptions: string[] = [];
  

 
  ngOnInit(): void {
    console.log(this.submitBtnName);

    this.nationList()
    this.stateList()

    // Dupilicate Form Method

    this.contactForm = this.fb.group({
      contacts: this.fb.array([this.createContact()])
    });

    this.contactFormQuali = this.fb.group({
      contactsQuali: this.fb.array([this.createContactQuali()])
    });
  
  

  this.rolesDropdown()

    const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[5];
    console.log(id,'staff_id');
    
    // this.profileId = parseInt(id);
    // this.getStaffList(this.profileId);
    
    if (id) {
      this.isEditMode = true;
      this.profileId = parseInt(id);
      this.getStaffList(this.profileId);
    }
     else {
      this.isEditMode = false;
    }

  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }



  onCheckboxChange(event: Event, option: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const roleId = option.id;
  
    if (isChecked) {
      if (!this.selectedOptions.includes(roleId)) {
        this.selectedOptions.push(roleId);
      }
    } else {
      this.selectedOptions = this.selectedOptions.filter(val => val !== roleId);
    }
  
    // Update the form's role field with the selected options
    this.f['role'].setValue(this.selectedOptions);
  }
  

getSelectedRoleNames(): string[] {
  return this.selectedOptions.map(id => {
    const role = this.rolesData.find((option: { id: string; }) => option.id === id);
    return role ? role.role_name : '';
  });
}




  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!event.target.closest('.custom-select')) {
      this.closeDropdown();
    }
  }


// Experience Dupilicate Forms Showed Method

 // Create contact form group
 createContact(): FormGroup {
  return this.fb.group({
    id:[''],
    school: [''],
    years: [''],
   
  });
}

// Add new contact form group
addContact() {
  this.contacts.push(this.createContact());
}

// Get form array
get contacts(): FormArray {
  return this.contactForm.get('contacts') as FormArray;
}


// Handle form changes
handleChange(i: number, controlName: string, event: any) {
  this.contacts.at(i).get(controlName)?.setValue(event.target.value);
}

onSubmit(): void {
  if (this.contactForm.valid) {
    // Convert form values to the desired format
    
    this.experiencesArray = this.contactForm.value.contacts.map((exp: any) => ({
      id: exp.id,
      school:exp.school,
      years: exp.years,
    }));
      
  }
}

// Experience Dupilicate Forms Showed Method End

// Qualification Dupilicate Forms Showed Method Start

createContactQuali(): FormGroup {
  return this.fb.group({
    degree: ['', Validators.required],
    year: [''],
    grade: [''],
    id: ['']
  });
}

// Add new qualification contact form group
addContactQuali() {
  this.contactsQuali.push(this.createContactQuali());
}

 
get contactsQuali(): FormArray {
  return this.contactFormQuali.get('contactsQuali') as FormArray;
}

// Handle form changes for qualifications
handleChangeQuali(i: number, controlName: string, event: any) {
  this.contactsQuali.at(i).get(controlName)?.setValue(event.target.value);
}

onSubmitQuali(): void {
  if (this.contactFormQuali.valid) {
    // Convert form values to the desired format
    this.qualificationArray = this.contactFormQuali.value.contactsQuali.map((qual: any) => ({
      id: qual.id,
      degree: qual.degree,
      year: qual.year,
      grade_percentage: qual.grade
    }));
    console.log(this.qualificationArray);

  
  }
}

// Qualification Dupilicate Forms Showed Method End

// Input Remove Experince

removeContactExp(index: number): void {
  if (this.contacts.length > 1) {  
    this.contacts.removeAt(index);
  } else {
    console.warn('Cannot remove the last contact.');
  }
}


// Input Remove Quali


removeContactQuali(index: number) {
  if (this.contactsQuali.length > 1) {
    this.contactsQuali.removeAt(index);
  }
}


  // Roles Dropdown Api

  private rolesDropdown(): void {
    this.staffService.assignRolesDropdown().subscribe((data) => {
      this.rolesData = data.body.responseData.roleList;
      this.rolesId = this.rolesData.map((role: { id: any; }) => role.id);
      this.totalItems = data.body.responseData.responseCount;
    });
  }
  

    // Nationality Dropdown Api

    private nationList(): void {
      this.staffService.nationalityClassDropdown().subscribe((data) => {
        console.log(data);
    
        // if (data.body && data.body.responseData) {
          // Assuming countryList is an array of country objects
          this.nationData = data.body.responseData.countryList;
    
          // Extract IDs into an array
          this.nationDataId = this.nationData.map((country: { country_name: string }) => country.country_name);
    
          console.log(this.nationDataId, " this.nationDataId");
        // }
      });
    }
    
  
     // State Dropdown Api
  
     private stateList(): void {

      // const bodyParams = {
      //   country_id: this.nationData,
      // }
     
      this.staffService
        .stateClassDropdown()
        
        .subscribe((data) => {
          console.log(data);

          // if (data.body && data.body.responseData) {
          //   // Assuming countryList is an array of country objects

          //   this.stateData = data.body.responseData.stateList;

            

          //   console.log(   this.stateData,"pppppp");
            
      
          //   // Extract IDs into an array
          //   this.stateData = this.stateData.map((state: { id: string }) => state.id);
      
          //   console.log(this.stateData, " this.stateData");
          // }
  
          this.stateData = data.body.responseData.stateList;
          this.stateDataId =  data.body.responseData.stateList.map((state: {name: any}) => ({ state: state.name }));

          console.log(
            data.body.responseData.stateList.map((state: { id: string }) => ({ state: state.id })),
            "mmmmmm"
          );
          
         
        });
    }
   



// Staff Get Method
private getStaffList(id: number) {
  const bodyParams = { id: id };

  this.staffService.getStaffDetails(bodyParams).subscribe(
    (response: any) => {
      this.loading = false;
      if (response.body.responseData) {
        const staffData = response.body.responseData.staffData;
        this.roleData = response.body.responseData.roles;
        const roleNames = response.body.responseData.roles.map((role: { role_id: any; }) => role.role_id);

        
        // Set selectedOptions with pre-existing roleNames
        this.selectedOptions = roleNames;

        // Qualification Method

        const qualifications = response.body.responseData.qualifications;
        if (qualifications && qualifications.length > 0) {
          // Clear existing form array
          while (this.contactsQuali.length !== 0) {
            this.contactsQuali.removeAt(0);
          }

          // Populate form array with fetched qualifications
          qualifications.forEach((qual: { degree: string, year: string, grade_percentage: string, id: string }) => {
            this.contactsQuali.push(this.fb.group({
              degree: [qual.degree, Validators.required],
              year: [qual.year],
              grade: [qual.grade_percentage], 
              id: [qual.id]
            }));
          });
        }

        // Experiecnce Method

        const experience = response.body.responseData.experiences;
        if (experience && experience.length > 0) {
          // Clear existing form array
          while (this.contacts.length !== 0) {
            this.contacts.removeAt(0);
          }

          // Populate form array with fetched qualifications
          experience.forEach((qual: { prev_school: string, years: string, id: string }) => {
            this.contacts.push(this.fb.group({
              school: [qual.prev_school, Validators.required],
              years: [qual.years],            
              id: [qual.id]
            }));
          });
        }

        console.log(experience,"ssssssssssssss");
        

        // Patch staff data
        this.addStaffForm.patchValue({
          staff_id: staffData.staff_id,
          first_name: staffData.first_name,
          middle_name: staffData.middle_name,
          last_name: staffData.last_name,
          dob: staffData.dob,
          email: staffData.email,
          gender: staffData.gender,
          designation: staffData.designation,
          date_of_appointment: staffData.date_of_appointment,
          state:  staffData.state_id,
          nationality: this.nationDataId,
          type: staffData.type,
          active_status: staffData.active_status,
          address: staffData.address,
          role: roleNames,
          qualifications: this.contactsQuali.value ,
          experiences:this.contacts.value
          // Make sure this is an array of qualifications
        });

        // Debugging output
        console.log('Qualifications:', qualifications);
        console.log('Form Values:', this.addStaffForm.value);
        console.log('this.nationDataId:', this.nationDataId);
        console.log('this.stateDataId', this.stateDataId);
        
      }
    },
    (error: any) => {
      this.loading = false;
      console.error(error);
    }
  );
}



  get f() {
    return this.addStaffForm.controls;
  }

  staffFormSubmit() {
    this.submitted = true;

    this.onSubmitQuali();
    this.onSubmit();

    // if (this.addStaffForm.invalid) {
    //   return;
    // }



    const bodyParams = {
      staff_data: {
        staff_id: this.f['staff_id'].value,
        first_name: this.f['first_name'].value,
        middle_name: this.f['middle_name'].value,
        last_name: this.f['last_name'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
        confirm_password: this.f['confirm_password'].value,
        dob: this.f['dob'].value,
        gender: this.f['gender'].value,
        phone: this.f['phone'].value,
        type: this.f['type'].value,
        designation: this.f['designation'].value,
        date_of_appointment: this.f['date_of_appointment'].value,
        nationality: this.f['nationality'].value,
        state: this.f['state'].value,
        address: this.f['address'].value,
        img_id: this.userimgId,
        role: Array.isArray(this.f['role'].value) ? this.f['role'].value : [this.f['role'].value],
        qualification: this.qualificationArray, 
        experience:  this.experiencesArray
      }
    };
    
const bodyQuery= this.isEditMode 
?
{
  staff_data: {
    id:this.profileId,
   
    first_name: this.f['first_name'].value,
    middle_name: this.f['middle_name'].value,
    last_name: this.f['last_name'].value,
    email: this.f['email'].value,
   
    dob: this.f['dob'].value,
    gender: this.f['gender'].value,
    phone: this.f['phone'].value,
    type: this.f['type'].value,
    designation: this.f['designation'].value,
    date_of_appointment: this.f['date_of_appointment'].value,
    nationality: this.f['nationality'].value,
    state: this.f['state'].value,
    address: this.f['address'].value,
    img_id: this.userimgId,
    role: Array.isArray(this.f['role'].value) ? this.f['role'].value : [this.f['role'].value],
    // role: this.selectedOptions,
    qualification: this.qualificationArray, 
    experience:  this.experiencesArray
  }
}

// Constructing the staff_data object with updated values
// {
// staff_data: { 
//   id: this.profileId,
//   first_name: this.f['first_name'].value,
//   middle_name: this.f['middle_name'].value,
//   last_name: this.f['last_name'].value,
//   email: this.f['email'].value,
//   dob: this.f['dob'].value,
//   gender: this.f['gender'].value,
//   phone: this.f['phone'].value,
//   type: this.f['type'].value,
//   designation: this.f['designation'].value,
//   date_of_appointment: this.f['date_of_appointment'].value,
//   nationality: Array.isArray(this.f['nationality'].value) ? this.f['nationality'].value : [this.f['nationality'].value],
//   state: Array.isArray(this.f['state'].value) ? this.f['state'].value : [this.f['state'].value],
//   address: this.f['address'].value,
//   img_id: this.userimgId,
//   role: Array.isArray(this.f['role'].value) ? this.f['role'].value : [this.f['role'].value],
//   qualification: Array.isArray(this.qualificationArray) ? this.qualificationArray : [this.qualificationArray],
//   experience: Array.isArray(this.experiencesArray) ? this.experiencesArray : [this.experiencesArray]
// }
// }


  : bodyParams;
  this.loading=true;

  if (this.isEditMode) {

    
    this.staffService.editStaffDetails(bodyQuery).subscribe(
      (response) => {
        this.loading = false;
        if (response.status === 200) {
          this.router.navigate(['/school/admin/staff/list']);
          this.toastr.success(response.body.message);
        } else {
          this.toastr.error(response.body.message);
        }
      },
      (error) => {
        this.loading = false;
        const errorMessage = error?.error?.message || 'An unknown error occurred';
        this.toastr.error(errorMessage, 'Failed');
        console.error(errorMessage);
      }
    );
  }
  else{
    this.loading = true;
    this.staffService.addStaffDetails(bodyQuery)
        .subscribe(
            (response) => {
                this.loading = false;
                if (response.status === 200) {
                  
                    this.router.navigate(['/school/admin/staff/list']);
                    this.toastr.success(response.body.message);
                } else {
                    this.toastr.error('Failed to create category', 'Error');
                }
            },
            (error) => {
                this.loading = false;
                this.toastr.error(error.error.message, 'Failed');
            }
          );
}

   
    this.loading = true;

   
  }

  // Password Eye

  toggleVisibility(field: 'password' | 'confirm_password') {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirm_password') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
  

  // Image Upload
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.upload1();
    }
  }

  upload1(): void {
    this.progress = 0;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.staffService.fileUploadStaff(this.currentFile).subscribe({
          next: (event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.toastr.success(event.body.message || 'File uploaded successfully');
              this.userimgId = event.body.responseData.img_id;
            }
          },
          error: (err: any) => {
            console.error('Upload Error:', err);
            this.progress = 0;
            this.toastr.error(err.error?.message || 'Could not upload the file!');
            this.currentFile = undefined;
          }
        });
      }
    }
  }



}
function isOptionSelected(option: any, any: any) {
  throw new Error('Function not implemented.');
}

