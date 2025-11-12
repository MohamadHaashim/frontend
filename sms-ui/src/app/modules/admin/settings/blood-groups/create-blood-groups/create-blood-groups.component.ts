import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-blood-groups',
  templateUrl: './create-blood-groups.component.html',
  styleUrl: './create-blood-groups.component.css'
})
export class CreateBloodGroupsComponent implements OnInit {
  schoolCreateForm: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.schoolCreateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}
  schoolFormSubmit() {}
}
