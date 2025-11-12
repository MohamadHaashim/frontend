import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrl: './states.component.css'
})
export class StatesComponent implements OnInit  {
  currentPath: string = '/admin/settings/states/list';
  deleteId: any;
  constructor(private router: Router) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/settings/states/create']);
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
