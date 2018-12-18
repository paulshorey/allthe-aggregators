import { CorrosionService } from "src/app/services/corrosion.service";
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
	selector: "form-login",
	templateUrl: "./form-login.component.html",
	styleUrls: ["./form-login.component.scss"]
})
export default class NzDemoFormNormalLoginComponent implements OnInit {
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }
}