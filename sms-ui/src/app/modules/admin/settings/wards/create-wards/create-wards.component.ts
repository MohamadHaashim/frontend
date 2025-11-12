import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-wards',
  templateUrl: './create-wards.component.html',
  styleUrl: './create-wards.component.css'
})
export class CreateWardsComponent implements OnInit {
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
