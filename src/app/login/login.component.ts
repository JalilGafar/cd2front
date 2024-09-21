import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { tokenStorageService } from '../service/token-storage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  form: any={};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[]= [];

  constructor(private auth: AuthService,
              //private authen : AuthenService, 
             // private router: Router,
             @Inject(PLATFORM_ID) private platformId: any,
              private tokenStorage: tokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void{
    this.auth.login(this.form).subscribe(
      data => {
        console.log('le token est '+ data.accessToken);
        this.tokenStorage.saveToken(data.accessToken);
        //this.tokenStorage.blade('JALIL_TOKEN');
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
    }

 // onLogin() {
 // //this.authen.login();
 // //this.router.navigateByUrl('admin/adminStart');
 // }

}

