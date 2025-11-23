import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginModel:any={
    username:"",
    password:""
  }
  login_message:string="";
  invalid_user:boolean=false;
  constructor(private globalService:GlobalService,private router:Router,private messageService:MessageService,) { }

  ngOnInit(): void {
  }

  Login()
  {
    console.log(this.loginModel);
    this.globalService.Login(this.loginModel).subscribe((response:any)=>{
      console.log(response)
      if(response.Status)
      {
        this.invalid_user=false;
        localStorage.setItem("user",JSON.stringify(response.user))
        console.log("Login successful")
        this.router.navigateByUrl("dashboard").then(()=>{
          location.reload()
        });
      }
      else{
        this.login_message="Invalid Username/Password"
        this.invalid_user=true;
      }
    })
  }

}
