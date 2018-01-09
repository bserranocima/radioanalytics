import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../providers/providers';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.scss']
})
export class AccountLoginComponent implements OnInit {

  signinForm: FormGroup;
  public errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {

    this.signinForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    })
  }

  get email() { return this.signinForm.get('email'); }

  get password() { return this.signinForm.get('password'); }

  public onFormSubmit() {
    if (this.signinForm.valid) {
      let user = this.signinForm.value;

      this.userService.login(user).then(res => {
        location.reload();
      }).catch(err => {
        console.error('User cannot be logged in');
        this.errorMessage = 'El usuario o la contraseña son incorrectos.';
      });


    }
  }

}
