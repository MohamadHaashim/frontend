import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.css'
})
export class HobbiesComponent implements OnInit  {
  currentPath: string = '/admin/settings/hobbies/list';
  deleteId: any;
  constructor(private router: Router) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/settings/hobbies/create']);
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
