import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../app';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'login-root',
  imports: [CommonModule, FormsModule, RouterOutlet, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: '../app.scss'
})
export class Login extends App {
  protected userDataModel = { email: "", pwd: "" };
  protected passwordValid = true

  protected validatePassword(){
    this.passwordValid = this.userDataModel.pwd.toLowerCase() != this.userDataModel.pwd && // nagybetűt tartalmaz
                         this.userDataModel.pwd.toUpperCase() != this.userDataModel.pwd && // kisbetűt tartalmaz
                         /.*\d.*/.test(this.userDataModel.pwd) // számot tartalmaz
  }
  protected onSubmit(){
    localStorage.setItem("userEmail", this.userDataModel.email)
    this.loggedIn = true
  }
  protected navigateToSearchPage(){
    this.router.navigateByUrl("/search")
  }
}
