import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MasterService } from '../../../../../core/service/master/master.service';

@Component({
  selector: 'app-create-fee',
  templateUrl: './create-fee.component.html',
  styleUrls: ['./create-fee.component.css'],
})
export class CreateFeeComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  addFeeForm: FormGroup;
  loading = false;
  submitted = false;
  headName = 'Add';
  submitBtnName = 'Create';
  categoryList: any;
  profileId: any;
  isEditMode = false;
  feeSectionData: any;
  feeClassData: any;


  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    protected html_sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    private masterService: MasterService
  ) {
    this.addFeeForm = this.formBuilder.group({
      section: ['', Validators.required],
      classLevel: ['', Validators.required],
      feeName: ['', Validators.required],
      amount: ['', Validators.required],
    });
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log(event.url);
        if (event.url == '/setup/fee/edit') {
          this.headName = 'Edit';
          this.submitBtnName = 'Update';
        } else {
          this.headName = 'Add';
          this.submitBtnName = 'Create';
        }
      });
  }

  ngOnInit(): void {

    const queryParams: string = window.location.pathname;
    const myArray = queryParams.toString().split("/");
    var id = myArray[5];
    console.log(myArray[5]);

    if(id){
      this.isEditMode = true;
      this.profileId = parseInt(id);

      this.getFeesList( this.profileId)
    }
   
    this.classList();
    this.sectionList();
  }


  // Sections Dropdown Api

  private sectionList(): void {
  
    this.masterService
      .feesSectionDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);

        this.feeSectionData = data.body.responseData.sectionList;

        if (this.feeSectionData && this.feeSectionData.section_name) {
          this.feeSectionData = this.feeClassData.id;
        } 
      });
  }

   // Classes Dropdown Api

   private classList(): void {
   
    this.masterService
      .feesClassDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data);

        this.feeClassData = data.body.responseData.classList;

        if (this.feeClassData && this.feeClassData.class_name) {
          this.feeClassData = this.feeClassData.id;
        }
        

       
      });
  }
 
  // convenience getter for easy access to form fields
  get f() {
    return this.addFeeForm.controls;
  }
  sameAsHtml(html_content: any) {
    return this.html_sanitizer.bypassSecurityTrustHtml(html_content);
  }

  // Fees Create 

  addFeesDetail(){
    this.submitted = true;
    if (this.addFeeForm.invalid) {
      return;
    }

    const bodyParams = {
      section_id:this.f['section'].value ,
      class_id:this.f['classLevel'].value ,
      fee_name:this.f['feeName'].value ,
      amount: this.f['amount'].value
    }

const bodyQuery= this.isEditMode 
?
{ fee_data: {
  id:this.profileId ,
  section_id:this.feeSectionData ,
  class_id: this.f['classLevel'].value,
  fee_name:this.f['feeName'].value,
  amount:this.f['amount'].value 
}}
:bodyParams;

this.loading=true;

if (this.isEditMode){

  this.masterService
  .getFeesEdit(bodyQuery)
  .pipe(first())
  .subscribe(
    (response) => {
      this.loading = false;
      if (response.status == 200) {
        console.log(response,"rrrrrrr");
        
        this.router.navigate(['/school/setup/fee/list']);
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
else {
  this.masterService
  .addFeesDetails(bodyQuery)
  .pipe(first())
  .subscribe(
    (response) => {
      this.loading = false;
      if (response.status == 200) {
        console.log(response,"rrrrrrr");
        
        this.router.navigate(['/school/setup/fee/list']);
        this.toastr.success(response.body.message);
      } else {
        this.toastr.error(response.body.message);
      }
    },

    (error) => {
      this.loading = false;
      this.toastr.error(error.error.message, 'Failed');
  }
  );
}




  }


  // Get Api

  private getFeesList(id: number) {

  
    const bodyParams = {
      id: id,
    };
    this.masterService.getFeesDetails(bodyParams).subscribe(
      (response:any) => {
        this.loading = false;
        if (response.body.responseData) {
  
          console.log(response.body.responseData);
          
      
         
          const feesValue = response.body.responseData
          console.log(feesValue);
          
  
          this.addFeeForm.patchValue({
            id:feesValue.id,
            feeName:feesValue.fee_name,
            amount:feesValue.amount,
            section:feesValue.section_name,

            classLevel:feesValue.class_name,
            
          });
         
        }
      },
      (error: any) => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  
  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
