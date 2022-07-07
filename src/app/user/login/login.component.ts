import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageConstants } from 'src/app/common/message.constants';
import { URLConstants } from 'src/app/common/url.constants';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  loginForm: FormGroup;
  model: any = {};
  returnUrl: string;
  title: "Đăng nhập";
  constructor(private titleService: Title, private router: Router, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.initializeForm();
    this.titleService.setTitle(this.title);
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      'username': new FormControl("", [Validators.required]),
      'password': new FormControl("", [Validators.required])
    })
  }

  login() {
    this.loading=true;
    this.authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
      .then(data => {
        this.router.navigateByUrl('/main/job')
      })
      .catch(error => {
        this.notificationService.printErrorMessage(MessageConstants.SYSTEM_ERROR_MSG);
        this.loading = false;
      })
  }
}
