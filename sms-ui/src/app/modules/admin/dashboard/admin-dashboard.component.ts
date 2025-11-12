import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  currentPath: string = '/admin/school/list';
  deleteId: any;
  constructor(private router: Router) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/school/create']);
  }

  ngOnInit(): void {
    
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
    
  }
}
