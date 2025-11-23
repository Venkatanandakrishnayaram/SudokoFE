import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss']
})
export class UserdashboardComponent implements OnInit {

  user:any={};
  userid:number=0;
  stats:any={}
  mostplayedlevel:any={}
  games:any[]=[]
  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    var data = localStorage.getItem("user");
    if (data != null && data != undefined) {
      this.user = JSON.parse(data);
      this.userid=this.user.userid;
    }
    this.getStats();
    this.getGames();
  }

  getStats()
  {
    this.globalService.winPercentage(this.userid).subscribe((response:any)=>{
      console.log(response);
      this.stats=response;
    });
    this.globalService.mostPlayedLevel(this.userid).subscribe((response:any)=>{
      console.log(response);
      this.mostplayedlevel=response;
    })
  }

  getGames()
  {
    this.globalService.getAllGames(this.userid).subscribe((response:any)=>{
      console.log(response);
      this.games=response.games;
    })
  }

}
