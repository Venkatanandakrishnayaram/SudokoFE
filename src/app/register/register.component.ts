import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  display:boolean=false;
  registerModel:any={
    firstname:"",
    lastname:"",
    email:"",
    username:"",
    password:""
  }
  constructor(private globalService:GlobalService,private messageService:MessageService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  showRegister()
  {
    this.display=true;
    console.log(this.display)
  }

  Register()
  {
    console.log(this.registerModel);
    this.globalService.register(this.registerModel).subscribe((response:any)=>{
      console.log(response)
      if(response.status)
      {
        this.messageService.add({severity:'success', summary:response.message});
        setTimeout(() => {
          this.router.navigateByUrl("login");
        }, 1500);
      }
      else{
        this.messageService.add({severity:'error', summary:response.message});
      }
    })
  }

}
