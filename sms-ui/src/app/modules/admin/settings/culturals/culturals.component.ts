import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-culturals',
  templateUrl: './culturals.component.html',
  styleUrl: './culturals.component.css'
})
export class CulturalsComponent implements OnInit  {
  currentPath: string = '/admin/settings/culturals/list';
  deleteId: any;
  constructor(private router: Router) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/settings/culturals/create']);
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
