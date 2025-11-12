import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-admitted-category',
  templateUrl: './create-admitted-category.component.html',
  // styleUrl: './create-admitted-category.component.css'
})
export class CreateAdmittedCategoryComponent implements OnInit {
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
