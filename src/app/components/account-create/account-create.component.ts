import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '../../models/User';

import { UserService } from '../../providers/providers';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {

  private user: User;
  errorMessage: string = '';
  successMessage: string = '';
  signupForm: FormGroup;
  public creating: boolean = false;
  

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: this.fb.group({
        pwd: ['', [Validators.required,
        Validators.minLength(8)]],
        confirmPwd: ['', [Validators.required,
        Validators.minLength(8)]]
      })
    })
  }

  get email() { return this.signupForm.get('email'); }

  get password() { return this.signupForm.get('password'); }

  public onFormSubmit() {
    if (this.signupForm.valid) {
      this.user = this.signupForm.value;

      this.creating = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.userService.create(this.user).then(res => {
        console.log('account  created');
        this.successMessage = 'Cuenta creada satisfactoriamente. Inicia sesión con tus credenciales';
      }).catch( err => {
        console.error('account cannot be created');
        this.errorMessage = "La cuenta no pudo ser creada. Verifica las credenciales o contacta al administrador para resolver el problema.";
      });
      
      
    }
  }

}
