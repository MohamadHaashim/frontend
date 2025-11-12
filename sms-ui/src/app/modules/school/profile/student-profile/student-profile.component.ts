import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  loginUserRole: any;
  studentId: any;
  public href: string = '';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.loginUserRole =
      this.currentUser.responseData.userDetail.roles.roleName;
    this.href = this.router.url;
    const url = this.href.split('/');
    if (url[1] !== 'student') {
      console.log(url[1]);
      this.studentId = this.activatedRoute.snapshot.params['studentId'];
      console.log('Student ID: ', this.studentId);
    } else {
      this.studentId = this.currentUser.responseData.userDetail.loginid;
      console.log('Student ID: ', this.studentId);
    }
  }
  clickTabMenu(curTab: any) {
    this.removeActive();
    const tabMenu = '.tab-' + curTab;
    const tabCont = '.tab-con-' + curTab;
    $('.tab-menu ul li' + tabMenu).addClass('active');
    $('.tab-con-container' + tabCont).addClass('active');
  }
  private removeActive() {
    $('.tab-menu ul li').removeClass('active');
    $('.tab-con-container').removeClass('active');
  }
}
