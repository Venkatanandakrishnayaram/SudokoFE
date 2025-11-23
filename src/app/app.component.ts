import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: any = {};
  userLoggedIn: boolean = false;
  loginModel: any = {
    email: "",
    firstname: "",
    lastname: "",
    userid: "",
    username: "",
  }
  constructor(private router: Router, private globalservice: GlobalService,
    private messageService: MessageService
  ) {

  }
  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    var data = localStorage.getItem("user");
    if (data != null && data != undefined) {
      this.user = JSON.parse(data);
      this.userLoggedIn = true;
      // this.router.navigateByUrl("dashboard");
    }
  }

  Logout() {
    this.userLoggedIn = false;
    localStorage.clear();
    this.user={}
    this.router.navigateByUrl("").then(location.reload);
  }
}
