import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Logger } from './core/log';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { ServiceProvider } from './core/service/service.provider';
import { ServiceConfig } from './core/service/service.url.config';

import { LoginLayoutComponent } from './shared/components/layouts/login-layout/login-layout.component';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { LoginFooterComponent } from './shared/components/footer/login-footer/login-footer.component';
import { AdminFooterComponent } from './shared/components/footer/admin-footer/admin-footer.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { LoginComponent } from './modules/login/login.component';
import { AdminLoginComponent } from './modules/admin/admin-login/admin-login.component';
import { SchoolLoginComponent } from './modules/school/school-login/school-login.component';

import { TopMenuBarComponent } from './shared/components/menu/top-menu-bar/top-menu-bar.component';
import { SideMenuBarComponent } from './shared/components/menu/side-menu-bar/side-menu-bar.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { DashboardComponent } from './modules/school/dashboard/dashboard.component';

import { ListStaffComponent } from './modules/school/staff/list-staff/list-staff.component';
import { MapStaffComponent } from './modules/school/staff/map-staff/map-staff.component';
import { MapStudentComponent } from './modules/school/student/map-student/map-student.component';
import { ListStudentComponent } from './modules/school/student/list-student/list-student.component';
import { ClassesComponent } from './modules/school/admin/setting/classes/classes.component';
import { RolesComponent } from './modules/school/admin/setting/roles/roles.component';

import { StaffReportComponent } from './modules/school/report/staff-report/staff-report.component';
import { StudentReportComponent } from './modules/school/report/student-report/student-report.component';
import { StaffProfileComponent } from './modules/school/profile/staff-profile/staff-profile.component';
import { StudentProfileComponent } from './modules/school/profile/student-profile/student-profile.component';
import { StaffAeFormComponent } from './shared/components/forms/staff-ae-form/staff-ae-form.component';
import { StudentAeFormComponent } from './shared/components/forms/student-ae-form/student-ae-form.component';
import { CreateStudentComponent } from './modules/school/student/create-student/create-student.component';
import { PrimaryDetailsComponent } from './modules/school/student/forms/primary-details/primary-details.component';
import { StudentPrimaryInfoComponent } from './modules/school/profile/student-profile/student-primary-info/student-primary-info.component';
import { StudentProfileContactDetailComponent } from './modules/school/profile/student-profile/student-profile-contact-detail/student-profile-contact-detail.component';
import { StudentProfileEducationDetailComponent } from './modules/school/profile/student-profile/student-profile-education-detail/student-profile-education-detail.component';
import { StudentProfileOtherDetailComponent } from './modules/school/profile/student-profile/student-profile-other-detail/student-profile-other-detail.component';
import { StudentProfilePersonalDetailComponent } from './modules/school/profile/student-profile/student-profile-personal-detail/student-profile-personal-detail.component';
import { StudentPrimaryInfoFormComponent } from './modules/school/profile/student-profile/student-primary-info/student-primary-info-form/student-primary-info-form.component';
import { StudentProfileContactDetailFormComponent } from './modules/school/profile/student-profile/student-profile-contact-detail/student-profile-contact-detail-form/student-profile-contact-detail-form.component';
import { StudentProfileEducationDetailFormComponent } from './modules/school/profile/student-profile/student-profile-education-detail/student-profile-education-detail-form/student-profile-education-detail-form.component';
import { StudentProfileOtherDetailFormComponent } from './modules/school/profile/student-profile/student-profile-other-detail/student-profile-other-detail-form/student-profile-other-detail-form.component';
import { StudentProfilePersonalDetailFormComponent } from './modules/school/profile/student-profile/student-profile-personal-detail/student-profile-personal-detail-form/student-profile-personal-detail-form.component';
import { CommentsComponent } from './modules/comments/comments.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateStaffsComponent } from './modules/school/staff/create-staffs/create-staffs.component';
import { AssignRoleComponent } from './modules/school/staff/assign-role/assign-role.component';
import { AssignClassComponent } from './modules/school/staff/assign-class/assign-class.component';
import { AssignSubjectComponent } from './modules/school/staff/assign-subject/assign-subject.component';
import { GeneralComponent } from './modules/school/setup/general/general.component';
import { SessionManagementComponent } from './modules/school/setup/session-mangement/session-management.component';
import { SubjectManagementComponent } from './modules/school/setup/subject-management/subject-management.component';
import { ListFeeComponent } from './modules/school/setup/fee-mangement/list-fee/list-fee.component';
import { CreateFeeComponent } from './modules/school/setup/fee-mangement/create-fee/create-fee.component';
import { ListUserComponent } from './modules/admin/user/list-user/list-user.component';
import { CreateSchoolComponent } from './modules/admin/school/school-create/create-school.component';
import { CreateUserComponent } from './modules/admin/user/create-user/create-user.component';

import { AdmittedCategoryComponent } from './modules/admin/settings/admitted-category/admitted-category.component';
import { BloodGroupsComponent } from './modules/admin/settings/blood-groups/blood-groups.component';
import { BoardComponent } from './modules/admin/settings/board/board.component';
import { CulturalsComponent } from './modules/admin/settings/culturals/culturals.component';
import { DistrictsComponent } from './modules/admin/settings/districts/districts.component';
import { HobbiesComponent } from './modules/admin/settings/hobbies/hobbies.component';
import { LanguagesComponent } from './modules/admin/settings/languages/languages.component';
import { CasteCategoriesComponent } from './modules/admin/settings/caste-categories/caste-categories.component';
import { PanchayatsComponent } from './modules/admin/settings/panchayats/panchayats.component';
import { ReligionsComponent } from './modules/admin/settings/religions/religions.component';
import { SportsComponent } from './modules/admin/settings/sports/sports.component';
import { StatesComponent } from './modules/admin/settings/states/states.component';
import { TaluksComponent } from './modules/admin/settings/taluks/taluks.component';
import { WardsComponent } from './modules/admin/settings/wards/wards.component';
import { CreateTaluksComponent } from './modules/admin/settings/taluks/create-taluks/create-taluks.component';
import { CreateAdmittedCategoryComponent } from './modules/admin/settings/admitted-category/create-admitted-category/create-admitted-category.component';
import { CreatePanchayatsComponent } from './modules/admin/settings/panchayats/create-panchayats/create-panchayats.component';
import { CreateWardsComponent } from './modules/admin/settings/wards/create-wards/create-wards.component';
import { CreateBoardComponent } from './modules/admin/settings/board/create-board/create-board.component';
import { CreateDistrictsComponent } from './modules/admin/settings/districts/create-districts/create-districts.component';
import { CreateStatesComponent } from './modules/admin/settings/states/create-states/create-states.component';
import { CreateSportsComponent } from './modules/admin/settings/sports/create-sports/create-sports.component';
import { CreateCulturalsComponent } from './modules/admin/settings/culturals/create-culturals/create-culturals.component';
import { CreateHobbiesComponent } from './modules/admin/settings/hobbies/create-hobbies/create-hobbies.component';
import { CreateLanguagesComponent } from './modules/admin/settings/languages/create-languages/create-languages.component';
import { CreateBloodGroupsComponent } from './modules/admin/settings/blood-groups/create-blood-groups/create-blood-groups.component';
import { CreateReligionsComponent } from './modules/admin/settings/religions/create-religions/create-religions.component';
import { CreateCasteCategoriesComponent } from './modules/admin/settings/caste-categories/create-caste-categories/create-caste-categories.component';
import { SchoolListComponent } from './modules/admin/school/school-list/school-list.component';
import { ForgotPasswordComponent } from './modules/admin/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/admin/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    AdminLayoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoginFooterComponent,
    AdminFooterComponent,
    NotfoundComponent,
    LoginComponent,
    AdminLoginComponent,
    SchoolLoginComponent,
    TopMenuBarComponent,
    SideMenuBarComponent,
    LoaderComponent,
    DashboardComponent,
    ListStaffComponent,
    MapStaffComponent,
    MapStudentComponent,
    ListStudentComponent,
    ClassesComponent,
    RolesComponent,
    ListUserComponent,
    StaffReportComponent,
    StudentReportComponent,
    SchoolListComponent,
    CreateSchoolComponent,
    StaffProfileComponent,
    StudentProfileComponent,
    StaffAeFormComponent,
    StudentAeFormComponent,
    CreateStudentComponent,
    PrimaryDetailsComponent,
    StudentPrimaryInfoComponent,
    StudentProfileContactDetailComponent,
    StudentProfileEducationDetailComponent,
    StudentProfileOtherDetailComponent,
    StudentProfilePersonalDetailComponent,
    StudentPrimaryInfoFormComponent,
    StudentProfileContactDetailFormComponent,
    StudentProfileEducationDetailFormComponent,
    StudentProfileOtherDetailFormComponent,
    StudentProfilePersonalDetailFormComponent,
    CommentsComponent,
    CreateStaffsComponent,
    AssignRoleComponent,
    AssignClassComponent,
    AssignSubjectComponent,
    GeneralComponent,
    SessionManagementComponent,
    SubjectManagementComponent,
    ListFeeComponent,
    CreateFeeComponent,
    CreateSchoolComponent,
    CreateUserComponent,
    AdmittedCategoryComponent,
    BloodGroupsComponent,
    BoardComponent,
    CulturalsComponent,
    DistrictsComponent,
    HobbiesComponent,
    LanguagesComponent,
    CasteCategoriesComponent,
    PanchayatsComponent,
    ReligionsComponent,
    SportsComponent,
    StatesComponent,
    TaluksComponent,
    WardsComponent,
    CreateTaluksComponent,
    CreateAdmittedCategoryComponent,
    CreatePanchayatsComponent,
    CreateWardsComponent,
    CreateBoardComponent,
    CreateDistrictsComponent,
    CreateStatesComponent,
    CreateSportsComponent,
    CreateCulturalsComponent,
    CreateHobbiesComponent,
    CreateLanguagesComponent,
    CreateBloodGroupsComponent,
    CreateReligionsComponent,
    CreateCasteCategoriesComponent
  ],
  imports: [
    BrowserModule,
    NgbPaginationModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    // AngularMultiSelectModule,
  ],
  providers: [
    { provide: ServiceProvider },
    Logger,
    ServiceConfig,
    CookieService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
