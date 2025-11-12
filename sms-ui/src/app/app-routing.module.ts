import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { LoginLayoutComponent } from './shared/components/layouts/login-layout/login-layout.component';
import { LoginComponent } from './modules/login/login.component';
import { AdminLoginComponent } from './modules/admin/admin-login/admin-login.component';
import { SchoolLoginComponent } from './modules/school/school-login/school-login.component';

import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
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
import { CreateStudentComponent } from './modules/school/student/create-student/create-student.component';

import { CommentsComponent } from './modules/comments/comments.component';
import { CreateStaffsComponent } from './modules/school/staff/create-staffs/create-staffs.component';
import { AssignRoleComponent } from './modules/school/staff/assign-role/assign-role.component';
import { AssignClassComponent } from './modules/school/staff/assign-class/assign-class.component';
import { AssignSubjectComponent } from './modules/school/staff/assign-subject/assign-subject.component';
import { GeneralComponent } from './modules/school/setup/general/general.component';
import { SessionManagementComponent } from './modules/school/setup/session-mangement/session-management.component';
import { SubjectManagementComponent } from './modules/school/setup/subject-management/subject-management.component';
import { ListFeeComponent } from './modules/school/setup/fee-mangement/list-fee/list-fee.component';
import { CreateFeeComponent } from './modules/school/setup/fee-mangement/create-fee/create-fee.component';
import { SchoolListComponent } from './modules/admin/school/school-list/school-list.component';

import { AdminDashboardComponent } from './modules/admin/dashboard/admin-dashboard.component';
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
import { SchoolViewComponent } from './modules/admin/school/school-view/school-view.component';
import { ForgotPasswordComponent } from './modules/admin/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/admin/reset-password/reset-password.component';

const routes: Routes = [
  // App default redirect page
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // App set/default Layout: Login layout
  {
    path: '',
    component: LoginLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
  {
    path: 'school',
    component: LoginLayoutComponent,
    children: [{ path: 'login', component: SchoolLoginComponent }],
  },
  {
    path:'forgot/password',component: ForgotPasswordComponent
  },
  {
    path:'resetPassword/:token',component: ResetPasswordComponent
  },
  // Admin Navigations
  {
    path: 'school/admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'staff/list', component: ListStaffComponent },
      { path: 'staff/create', component: CreateStaffsComponent },
      { path: 'staff/edit/:id', component: CreateStaffsComponent },

      { path: 'staff/edit', component: CreateStaffsComponent },
      { path: 'assign/role', component: AssignRoleComponent },
      { path: 'assign/class', component: AssignClassComponent },
      { path: 'assign/subject', component: AssignSubjectComponent },
      { path: 'staff/map', component: MapStaffComponent },
      { path: 'student/map', component: MapStudentComponent },
      { path: 'student/list', component: ListStudentComponent },
      { path: 'student/create', component: CreateStudentComponent },
      {
        path: 'profile/student/:studentId',
        component: StudentProfileComponent,
      },
      { path: 'profile/staff', component: StaffProfileComponent },
      { path: 'report/student', component: StudentReportComponent },
      { path: 'report/staff', component: StaffReportComponent },
      { path: 'setting/classes', component: ClassesComponent },
      { path: 'setting/roles', component: RolesComponent },

      { path: 'comments/student/:studentId', component: CommentsComponent },
    ],
  },

  // Staff Navigations
  {
    path: 'school/staff',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'student/list', component: ListStudentComponent },
      { path: 'student/create', component: CreateStudentComponent },
      { path: 'my-profile', component: StaffProfileComponent },
      { path: 'profile/student', component: StudentProfileComponent },
      { path: 'comments/student/:studentId', component: CommentsComponent },
    ],
  },
  {
    path: 'school/setup',
    component: AdminLayoutComponent,
    children: [
      { path: 'general/create', component: GeneralComponent },
      {
        path: 'session-mangement/create',
        component: SessionManagementComponent,
      },
      {
        path: 'subject-management/create',
        component: SubjectManagementComponent,
      },
      { path: 'fee/list', component: ListFeeComponent },
      { path: 'fee/create', component: CreateFeeComponent },
      { path: 'fee/edit/:id', component: CreateFeeComponent },
    ],
  },

  // Student Navigations
  {
    path: 'school/student',
    component: AdminLayoutComponent,
    children: [
      // { path: 'dashboard', component: DashboardComponent},
      { path: 'my-profile', component: StudentProfileComponent },
    ],
  },

  {
    path: 'school/parent',
    component: AdminLayoutComponent,
    children: [
      // { path: 'dashboard', component: DashboardComponent},
      { path: 'my-profile', component: StudentProfileComponent },
    ],
  },
  
  {
    path: 'admin',
    component: LoginLayoutComponent,
    children: [{ path: 'login', component: AdminLoginComponent }],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: 'school',
        children: [
          { path: 'list', component: SchoolListComponent },
          { path: 'create', component: CreateSchoolComponent },
          {path : 'view/:id', component:SchoolViewComponent},
          { path: 'edit/:id', component: CreateSchoolComponent },
        ]
      },
      {
        path: 'user',
        children: [
          { path: 'list', component: ListUserComponent },
          { path: 'create', component: CreateUserComponent },
          { path: 'edit/:id', component: CreateUserComponent },
        ]
      },
      {
        path: 'settings',
        children: [
          { 
            path: 'admitted-category',
            children: [
              { path: 'list', component: AdmittedCategoryComponent },
              { path: 'create', component: CreateAdmittedCategoryComponent },
            ]
          },
          { 
            path: 'blood-groups',
            children: [
              { path: 'list', component: BloodGroupsComponent },
              { path: 'create', component: CreateBloodGroupsComponent }
            ]
          },
          { 
            path: 'board',
            children: [
              { path: 'list', component: BoardComponent },
              { path: 'create', component: CreateBoardComponent }
            ]
          },
          { 
            path: 'culturals',
            children: [
              { path: 'list', component: CulturalsComponent },
              { path: 'create', component: CreateCulturalsComponent }
            ]
          },
          { 
            path: 'districts',
            children: [
              { path: 'list', component: DistrictsComponent },
              { path: 'create', component: CreateDistrictsComponent }
            ]
          },
          { 
            path: 'hobbies',
            children: [
              { path: 'list', component: HobbiesComponent },
              { path: 'create', component: CreateHobbiesComponent }
            ]
          },
          { 
            path: 'languages',
            children: [
              { path: 'list', component: LanguagesComponent },
              { path: 'create', component: CreateLanguagesComponent }
            ]
          },
          {
            path: 'caste-categories',
            children: [
              { path: 'list', component: CasteCategoriesComponent },
              { path: 'create', component: CreateCasteCategoriesComponent },
              { path: 'edit/:casteId', component: CreateCasteCategoriesComponent },
            ]
          },
          { 
            path: 'panchayats',
            children: [
              { path: 'list', component: PanchayatsComponent },
              { path: 'create', component: CreatePanchayatsComponent }
            ]
          },
          { 
            path: 'religions',
            children: [
              { path: 'list', component: ReligionsComponent },
              { path: 'create', component: CreateReligionsComponent },
              { path: 'edit/:religionId', component: CreateReligionsComponent }
            ]
          },
          { 
            path: 'sports',
            children: [
              { path: 'list', component: SportsComponent },
              { path: 'create', component: CreateSportsComponent }
            ]
          },
          { 
            path: 'states',
            children: [
              { path: 'list', component: StatesComponent },
              { path: 'create', component: CreateStatesComponent }
            ]
          },
          { 
            path: 'taluks',
            children: [
              { path: 'list', component: TaluksComponent },
              { path: 'create', component: CreateTaluksComponent }
            ]
          },
          { 
            path: 'wards',
            children: [
              { path: 'list', component: WardsComponent },
              { path: 'create', component: CreateWardsComponent }
            ]
          },
        ]
      }
    ],
  },

  // App page not found redirect
  {
    path: '**',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
