import { Component } from '@angular/core';
import { PasswordManagerService } from 'src/services/password-manager.service';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isError:Boolean=false;
  constructor(private passwordManager:PasswordManagerService,private router:Router){}
  onSubmit(values:any){
this.passwordManager.login(values.email,values.password)
.then(()=>{
  this.router.navigate(['/site-list']);
})
.catch(err=>{
  this.isError=true;
})
  }
}
