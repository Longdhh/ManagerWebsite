import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.initializeForm();

  }

  initializeForm() {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
    }) ;
  }
  onSubmit(): void {
    console.log(this.forgotPasswordForm);
  }
}
