import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-states',
  templateUrl: './create-states.component.html',
  styleUrl: './create-states.component.css'
})
export class CreateStatesComponent implements OnInit {
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
