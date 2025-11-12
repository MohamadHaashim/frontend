import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-panchayats',
  templateUrl: './create-panchayats.component.html',
  styleUrl: './create-panchayats.component.css'
})
export class CreatePanchayatsComponent implements OnInit {
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
