import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent implements OnInit  {
  currentPath: string = '/admin/settings/sports/list';
  deleteId: any;
  constructor(private router: Router) {}
  
  navigateToCreate() {
    this.router.navigate(['/admin/settings/sports/create']);
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
